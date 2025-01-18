import { MouseEvent } from "react";
import { Bookshelf, Bookmark, BookmarkType } from "../../types/store";
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
  navigateTo?: (bookmark: Bookmark) => void;
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
      const { bookmark: file, offsetBetweenStartPointAndFileLeftTop } =
        dragAndDrop || {};

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
      bookmark,
      point,
    }: {
      event: React.MouseEvent<HTMLElement, MouseEvent>;
      bookmark: Bookmark;
      point: { x: number; y: number };
    }) => {
      event.stopPropagation();
      const { currentTarget, ctrlKey, shiftKey } = event;
      console.log("mousedown >> ", bookmark, event);

      // 멀티 포커스인 경우는 기존 포커스 유지
      if (!(ctrlKey || shiftKey)) {
        clearFocus();
      }

      // 공통
      setDragAndDrop({ bookmark: bookmark });

      addFocus([bookmark.id]);
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
    mouseUp: async (e: React.MouseEvent, bookmark: Bookmark) => {
      const {
        mouseDownAt,
        startPoint,
        offsetBetweenStartPointAndFileLeftTop,
        bookmark: draggingBookmark,
      } = dragAndDrop || {};

      if (
        !mouseDownAt ||
        !startPoint ||
        !draggingBookmark ||
        !offsetBetweenStartPointAndFileLeftTop ||
        bookmark.type !== BookmarkType.FOLDER
      ) {
        return;
      }

      e.stopPropagation();

      try {
        const folder = bookmark;

        /* NOTE: 빈공간 : placeholder가 보이는 위치로 이동(저장)*/
        const { id: draggingBookmarkId } = draggingBookmark;
        const { id: folderId } = folder;

        if (draggingBookmarkId === folderId) {
          throw Error(`Try Move From ${draggingBookmarkId} to ${folderId}`);
        }
        const { row, col } = getRowColFromMouseEvent(e);

        /**
         * 북마크인 경우: 레이아웃을 업데이트.
         * 북마크가 아닌 경우: 레이아웃을 삭제.
         */
        const updateLayoutOrDelete =
          folder.type === BookmarkType.PAGE
            ? layoutDB.setItemLayoutById({
                id: draggingBookmarkId,
                parentId: folderId,
                col,
                row,
              })
            : layoutDB.deleteItemLayoutById(draggingBookmarkId);

        await Promise.all([
          updateLayoutOrDelete,
          BookmarkApi.move(draggingBookmarkId, folderId),
        ]);
      } catch {
        //
      } finally {
        await refreshBookmark();
        flush();
      }
    },
    doubleClick: (bookmark: Bookmark) => {
      if (bookmark.type === BookmarkType.FOLDER && navigateTo) {
        navigateTo(bookmark);
        return;
      }

      /** @NOTE: Desktop인 경우 */
      if (bookmark.type === BookmarkType.FOLDER) {
        openFolder(bookmark.id);
        return;
      }

      window.open(bookmark.url, "_blank")?.focus();
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
