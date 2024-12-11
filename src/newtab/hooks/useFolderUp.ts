import { File, FileType } from "../../types/store";
import { bookmarkStore } from "../store/bookmarkStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import { folderStore } from "../store/folder";
import BookmarkApi from "../utils/bookmarkApi";
import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "../utils/constant";
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

      const { clientX, clientY } = e;
      const { x: bookshelfX, y: bookshelfY } =
        e.currentTarget.getBoundingClientRect();
      const { scrollTop, scrollLeft } = e.currentTarget;

      const row =
        Math.floor(
          (clientY + scrollTop - bookshelfY - GRID_CONTAINER_PADDING) /
            ITEM_HEIGHT
        ) + 1;

      const col =
        Math.floor(
          (clientX + scrollLeft - bookshelfX - GRID_CONTAINER_PADDING) /
            ITEM_WIDTH
        ) + 1;

      await Promise.all([
        layoutDB.setItemLayoutById({
          id: draggingFileId,
          parentId: folderId,
          col,
          row,
        }),
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
