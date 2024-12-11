import { File, FileType } from "../../types/store";
import { bookmarkStore } from "../store/bookmarkStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import { folderStore } from "../store/folder";
import BookmarkApi from "../utils/bookmarkApi";
import { getRowColFromMouseEvent } from "../utils/getRowColUpdatedFiles";
import { layoutDB } from "../utils/layoutDB";

export const useFolderUp = () => {
  const {
    mouseDownAt,
    startPoint,
    file: draggingFile,
    flush,
    offsetBetweenStartPointAndFileLeftTop,
  } = dragAndDropStore();
  const { openFolder } = folderStore();

  const { refreshBookmark } = bookmarkStore();

  const folderMouseUpHandler = async (e: React.MouseEvent, file: File) => {
    console.log("folderUP");

    if (!mouseDownAt || !startPoint) return;

    const moveX = Math.abs(startPoint.x - e.pageX);
    const moveY = Math.abs(startPoint.y - e.pageY);

    const isClick =
      new Date().getTime() - mouseDownAt < 150 && moveX + moveY < 20;

    if (isClick) {
      /** @TODO 클릭 시 툴팁 처리? */
      file.type === "FOLDER"
        ? openFolder(file.id)
        : window.open(file.url, "_blank")?.focus();

      flush();
      return;
    }

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
  };

  return { folderMouseUpHandler };
};

// 모달 => 모달
// 폴더 =>
