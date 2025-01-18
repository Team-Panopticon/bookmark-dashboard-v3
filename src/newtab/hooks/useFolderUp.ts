import { Bookmark, BookmarkType } from "../../types/store";
import { bookmarkStore } from "../store/bookmarkStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import { folderStore } from "../store/folder";
import BookmarkApi from "../utils/bookmarkApi";
import { getRowColFromMouseEvent } from "../utils/getRowColUpdatedFiles";
import { layoutDB } from "../utils/layoutDB";

export const useFolderUp = ({
  navigateTo,
}: {
  navigateTo?: (bookmark: Bookmark) => void;
}) => {
  const {
    mouseDownAt,
    startPoint,
    bookmark: draggingFile,
    flush,
    offsetBetweenStartPointAndFileLeftTop,
  } = dragAndDropStore();
  const { openFolder } = folderStore();

  const { refreshBookmark } = bookmarkStore();

  const doubleClickHandler = (bookmark: Bookmark) => {
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
  };

  const folderMouseUpHandler = async (
    e: React.MouseEvent,
    bookmark: Bookmark
  ) => {
    if (
      !mouseDownAt ||
      !startPoint ||
      !draggingFile ||
      !offsetBetweenStartPointAndFileLeftTop ||
      bookmark.type !== BookmarkType.FOLDER
    ) {
      return;
    }
    e.stopPropagation();

    try {
      const folder = bookmark;

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
        folder.type === BookmarkType.PAGE
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
  };

  return { folderMouseUpHandler, doubleClickHandler };
};

// 모달 => 모달
// 폴더 =>
