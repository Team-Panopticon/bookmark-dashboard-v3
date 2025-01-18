import { MouseEvent } from "react";
import { Bookshelf, File, FileType } from "../../types/store";
import BookmarkApi from "../utils/bookmarkApi";
import { layoutDB } from "../utils/layoutDB";
import {
  getOffsetBetweenPoints,
  MOUSE_CLICK,
  rootStore,
} from "../store/rootStore";
import { getRowColFromMouseEvent } from "../utils/getRowColUpdatedFiles";

export const useEventHandler = ({
  bookshelf,
  navigateTo,
}: {
  bookshelf?: Bookshelf;
  navigateTo?: (file: File) => void;
}) => {
  const {
    dragAndDrop,
    addFocus,
    clearFocus,
    setDragAndDrop,
    setContextMenu,
    flush,
    refreshBookmark,
    openFolder,
    focusFolder,
    closeFolder,
  } = rootStore();

  const globalEventHandelr = {
    //
  };

  const bookshelfEventHandler = {
    mouseUp: async (e: React.MouseEvent) => {
      const { file, offsetBetweenStartPointAndFileLeftTop } = dragAndDrop || {};

      if (!file || !bookshelf || !offsetBetweenStartPointAndFileLeftTop) {
        return;
      }

      const { row, col } = getRowColFromMouseEvent(e);

      const { id } = file;
      const parentId = bookshelf?.id;

      layoutDB.setItemLayoutById({
        id,
        parentId,
        row,
        col,
      });
      await BookmarkApi.move(id, parentId);

      flush();
      refreshBookmark();
    },

    // 마우스 다운
    mouseDown: (e: React.MouseEvent<HTMLElement>) => {
      if (!(e.ctrlKey || e.shiftKey)) {
        clearFocus();
      }
    },
  };

  const bookmarkEventHandler = {
    // 마우스 다운
    mouseDown: ({
      event,
      file,
      point,
    }: {
      event: React.MouseEvent<HTMLElement, MouseEvent>;
      file: File;
      point: { x: number; y: number };
    }) => {
      event.stopPropagation();
      const { currentTarget, ctrlKey, shiftKey } = event;
      console.log("mousedown >> ", file, event);

      // 멀티 포커스인 경우는 기존 포커스 유지
      if (!(ctrlKey || shiftKey)) {
        clearFocus();
      }

      // 공통
      setDragAndDrop({ file });

      addFocus([file.id]);
      // 우클릭
      if (event.button === MOUSE_CLICK.RIGHT) {
        event.preventDefault();

        setContextMenu({
          isContextMenuVisible: true,
          contextMenuPosition: { x: event.clientX, y: event.clientY },
        });

        return;
      }
      // move 에 대한 상태관리
      const offsetBetweenStartPointAndFileLeftTop = getOffsetBetweenPoints(
        point,
        currentTarget?.getBoundingClientRect()
      );

      setDragAndDrop({
        startPoint: point,
        bookshelfAtMouseDown: bookshelf,
        fileElement: currentTarget,
        mouseDownAt: Date.now(),
        offsetBetweenStartPointAndFileLeftTop,
      });
    },
    // 마우스 업
    mouseUp: async (e: React.MouseEvent, file: File) => {
      const {
        mouseDownAt,
        startPoint,
        offsetBetweenStartPointAndFileLeftTop,
        file: draggingFile,
      } = dragAndDrop || {};

      if (
        !mouseDownAt ||
        !startPoint ||
        !draggingFile ||
        !offsetBetweenStartPointAndFileLeftTop ||
        file.type !== FileType.FOLDER
      ) {
        return;
      }

      e.stopPropagation();

      try {
        const folder = file;

        /* NOTE: 빈공간 : placeholder가 보이는 위치로 이동(저장)*/
        const { id: draggingFileId } = draggingFile;
        const { id: folderId } = folder;

        if (draggingFileId === folderId) {
          throw Error(`Try Move From ${draggingFileId} to ${folderId}`);
        }
        const { row, col } = getRowColFromMouseEvent(e);

        /**
         * 북마크인 경우: 레이아웃을 업데이트.
         * 북마크가 아닌 경우: 레이아웃을 삭제.
         */
        const updateLayoutOrDelete =
          folder.type === FileType.BOOKMARK
            ? layoutDB.setItemLayoutById({
                id: draggingFileId,
                parentId: folderId,
                col,
                row,
              })
            : layoutDB.deleteItemLayoutById(draggingFileId);

        await Promise.all([
          updateLayoutOrDelete,
          BookmarkApi.move(draggingFileId, folderId),
        ]);
      } catch {
        //
      } finally {
        await refreshBookmark();
        flush();
      }
    },
    doubleClick: (file: File) => {
      if (file.type === FileType.FOLDER && navigateTo) {
        navigateTo(file);
        return;
      }

      /** @NOTE: Desktop인 경우 */
      if (file.type === FileType.FOLDER) {
        openFolder(file.id);
        return;
      }

      window.open(file.url, "_blank")?.focus();
    },
  };

  const contextMenuEventHandler = {
    // 클릭 : 수정
    // 클릭 : 이름변경
    // 클릭 삭제
    // 클릭 : 생성
  };

  const draggingFilEventHandler = {
    mouseUp: bookmarkEventHandler.mouseUp,
  };

  const folderEventHanlder = {
    mouseDown: (timestampId: string) => focusFolder(timestampId),
    closeButtonClick: (timestampId: string) => closeFolder(timestampId),
  };

  return {
    globalEventHandelr,
    bookmarkEventHandler,
    bookshelfEventHandler,
    draggingFilEventHandler,
    folderEventHanlder,
    contextMenuEventHandler,
  };
};
