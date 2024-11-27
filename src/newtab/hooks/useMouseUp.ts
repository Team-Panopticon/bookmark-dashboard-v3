import { bookmarkStore } from "../store/bookmarkStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import { folderStore } from "../store/folder";
import BookmarkApi from "../utils/bookmarkApi";
import { layoutDB } from "../utils/layoutDB";

export const useMouseUp = () => {
  const {
    mouseDownAt,
    startPoint,
    file,
    flush,
    positionHolder,
    bookshelfAtMouseMove,
  } = dragAndDropStore();
  const { openFolder } = folderStore();
  const { refreshBookmark } = bookmarkStore();

  const mouseUpHandler = async (e: React.MouseEvent) => {
    if (!mouseDownAt || !startPoint || !file) {
      return;
    }

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

    if (!positionHolder || !bookshelfAtMouseMove) return;

    /* NOTE: 빈공간 : placeholder가 보이는 위치로 이동(저장)*/
    const { id: parentId } = bookshelfAtMouseMove;
    const { id } = file;
    const { row, col } = positionHolder;

    layoutDB.setItemLayoutById({
      id,
      parentId,
      row,
      col,
    });
    await BookmarkApi.move(id, parentId);

    flush();
    refreshBookmark();
  };

  return { mouseUpHandler };
};
