import { bookmarkStore } from "../store/bookmarkStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import BookmarkApi from "../utils/bookmarkApi";
import { getRowColFromMouseEvent } from "../utils/getRowColUpdatedFiles";
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

    const { row, col } = getRowColFromMouseEvent(e);

    const { id } = file;

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
