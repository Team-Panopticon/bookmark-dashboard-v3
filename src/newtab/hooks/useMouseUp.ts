import { bookmarkStore } from "../store/bookmarkStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import BookmarkApi from "../utils/bookmarkApi";
import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "../utils/constant";
import { layoutDB } from "../utils/layoutDB";

export const useMouseUp = ({ parentId }: { parentId: string }) => {
  const { file, flush, offsetBetweenStartPointAndFileLeftTop } =
    dragAndDropStore();
  const { refreshBookmark } = bookmarkStore();

  const mouseUpHandler = async (e: React.MouseEvent) => {
    if (!file) {
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
