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
    /** @NOTE: 복수선택(ctrl, shift)이 아닌 경우 포커스를 해제 */
    handleMouseDownBookshelf: (e: React.MouseEvent<HTMLElement>) => {
      if (!(e.ctrlKey || e.shiftKey)) {
        clearFocus();
      } else {
        // 복수 선택
      }
    },
    /** @NOTE: 빈공간에 드랍하는 경우 북마크를 빈공간으로 이동 */
    handleMouseUpBookshelf: async (e: React.MouseEvent) => {
      const { row, col } = getRowColFromMouseEvent(e);

      const { bookmark: file, offsetBetweenStartPointAndFileLeftTop } =
        dragAndDrop || {};

      if (!file || !bookshelf || !offsetBetweenStartPointAndFileLeftTop) {
        return;
      }

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
  };

  const bookmarkEventHandler = {
    /** @NOTE:
     * 1. 멀티 포커스인 경우 포커스 유지 else 신규 포커스
     * 2. 우클릭을 하는 경우 컨텍스트 메뉴 오픈
     * 3. 드래그 앤 드랍 대상 정보를 스토어에 저장
     */
    handleMouseDownBookmark: ({
      event,
      bookmark,
    }: {
      event: React.MouseEvent<HTMLElement>;
      bookmark: Bookmark;
    }) => {
      event.stopPropagation();
      const { currentTarget, ctrlKey, shiftKey, pageX, pageY } = event;
      const point = { x: pageX, y: pageY };

      console.log("mousedown >> ", bookmark, event);
      // point: { x: e.pageX, y: e.pageY },
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
    /** @NOTE:
     * 폴더 위에 북마크를 드랍하는 경우
     * 1. 페이지인 경우 레이아웃(row, col)을 업데이트
     * 2. 폴더인 경우 레이아웃(row, col) 삭제
     * 3. 북마크를
     */
    handleMouseUpBookmark: async (e: React.MouseEvent, bookmark: Bookmark) => {
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
        !offsetBetweenStartPointAndFileLeftTop
        // ||
        // bookmark.type !== BookmarkType.FOLDER
      ) {
        return;
      }

      e.stopPropagation();

      try {
        const folder = bookmark;

        const { id: draggingBookmarkId } = draggingBookmark;
        const { id: folderId } = folder;
        // debugger;
        if (draggingBookmarkId === folderId) {
          throw Error(`Try Move From ${draggingBookmarkId} to ${folderId}`);
        }
        const { row, col } = getRowColFromMouseEvent(e);

        // folder 아이콘 위에 북마크를 넣는 경우

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
    handleDoubleClickBookmark: (bookmark: Bookmark) => {
      // folder 내부에서 폴더 여는 경우
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
    mouseUp: bookmarkEventHandler.handleMouseUpBookmark,
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
