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
    setEdit,
    focus,
    removeFocus,
    moveFocus,
    contextMenu,
  } = rootStore();

  const globalEventHandelr = {
    handleKeyDown: (e: KeyboardEvent) => {
      // textarea에서는 작동하지 않도록 함
      if (
        e.target instanceof HTMLTextAreaElement &&
        contextMenu.isContextMenuVisible
      ) {
        return;
      }

      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        moveFocus(e.key);
      }
    },
    handleMouseUp: async (e: MouseEvent) => {
      const { pageX, pageY } = e;
      if (pageX <= 0 || pageY <= 0) {
        await refreshBookmark();
        flush();
      }
    },
  };

  const bookshelfEventHandler = {
    /** @NOTE: 복수선택(ctrl, shift)이 아닌 경우 포커스를 해제 */
    handleMouseDownBookshelf: (
      event: React.MouseEvent<HTMLElement>,
      bookmark: Bookmark
    ) => {
      setContextMenu({ isContextMenuVisible: false, context: bookmark });

      if (!(event.ctrlKey || event.shiftKey)) {
        clearFocus();
      } else {
        // 복수 선택
      }

      if (event.button === MOUSE_CLICK.RIGHT) {
        event.preventDefault();
        event.stopPropagation();

        setContextMenu({
          isContextMenuVisible: true,
          context: bookmark,
          contextMenuPosition: { x: event.clientX, y: event.clientY },
        });

        return;
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
      timestamp,
    }: {
      event: React.MouseEvent<HTMLElement>;
      bookmark: Bookmark;
      timestamp: string;
    }) => {
      setContextMenu({ isContextMenuVisible: false });
      setEdit(null);

      event.stopPropagation();
      const { currentTarget, ctrlKey, metaKey, shiftKey, pageX, pageY } = event;
      const point = { x: pageX, y: pageY };

      /** @NOTE: control, shift, meta 키가 눌려있는지 */
      const pressedCmdKey = ctrlKey || shiftKey || metaKey;

      // point: { x: e.pageX, y: e.pageY },

      const timestampId = `${timestamp}_${bookmark.id}`;

      // 좌클릭
      if (event.button === MOUSE_CLICK.LEFT) {
        if (pressedCmdKey) {
          if (focus.focusedIds.has(timestampId)) {
            removeFocus([timestampId]);
          } else {
            addFocus([timestampId], timestamp);
          }
        } else {
          clearFocus();
          addFocus([timestampId], timestamp);
        }

        // move 에 대한 상태관리
        const offsetBetweenStartPointAndFileLeftTop = getOffsetBetweenPoints(
          point,
          currentTarget.getBoundingClientRect()
        );

        setDragAndDrop({
          bookmark: bookmark,
          startPoint: point,
          bookshelfAtMouseDown: bookshelf,
          fileElement: currentTarget,
          mouseDownAt: Date.now(),
          offsetBetweenStartPointAndFileLeftTop,
          timestamp,
        });
        return;
      }

      // 우클릭
      if (event.button === MOUSE_CLICK.RIGHT) {
        event.preventDefault();

        if (!focus.focusedIds.has(timestampId)) {
          clearFocus();
          addFocus([timestampId], timestamp);
        }

        setContextMenu({
          isContextMenuVisible: true,
          timestampId: timestampId,
          contextMenuPosition: { x: event.clientX, y: event.clientY },
        });

        return;
      }
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
      ) {
        return;
      }

      e.stopPropagation();

      try {
        const { id: draggingBookmarkId } = draggingBookmark;
        const { id: bookmarkId } = bookmark;

        if (draggingBookmarkId === bookmarkId) {
          throw Error(`Try Move From ${draggingBookmarkId} to ${bookmarkId}`);
        }

        if (bookmark.type === BookmarkType.FOLDER) {
          await Promise.all([
            layoutDB.deleteItemLayoutById(draggingBookmarkId),
            BookmarkApi.move(draggingBookmarkId, bookmarkId),
          ]);
        }
      } catch {
        //
      } finally {
        await refreshBookmark();
        flush();
      }
    },

    /** @NOTE:
     * 1. Folder 내부에서 폴더 여는 경우
     * 2. Desktop인 경우
     */
    handleDoubleClickBookmark: (bookmark: Bookmark) => {
      // 1
      if (bookmark.type === BookmarkType.FOLDER && navigateTo) {
        navigateTo(bookmark);
        return;
      }

      // 2
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
    handleMouseDown: (timestamp: string) => {
      setContextMenu({ isContextMenuVisible: false });
      focusFolder(timestamp);
    },
    handleCloseButtonClick: (timestamp: string) => closeFolder(timestamp),
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
