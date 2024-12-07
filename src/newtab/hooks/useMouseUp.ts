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

export const useMouseUp = ({ parentId }: { parentId: string }) => {
  const {
    mouseDownAt,
    startPoint,
    file,
    flush,
    offsetBetweenStartPointAndFileLeftTop,
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

    if (!offsetBetweenStartPointAndFileLeftTop) return;

    const { clientX, clientY } = e;
    const { x: bookshelfX, y: bookshelfY } =
      e.currentTarget.getBoundingClientRect();
    const { scrollTop, scrollLeft } = e.currentTarget;

    const { id } = file;
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
