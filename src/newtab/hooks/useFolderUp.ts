import { File, FileType } from "../../types/store";
import { bookmarkStore } from "../store/bookmarkStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import BookmarkApi from "../utils/bookmarkApi";
import { layoutDB } from "../utils/layoutDB";

export const useFolderUp = () => {
  const { mouseDownAt, startPoint, file, flush } = dragAndDropStore();
  const { refreshBookmark } = bookmarkStore();

  const folderMouseUpHandler = async (e: React.MouseEvent, folder: File) => {
    console.log("folderUP");
    if (!mouseDownAt || !startPoint || !file || file.type !== FileType.FOLDER) {
      return;
    }

    // e.stopPropagation();
    const moveX = Math.abs(startPoint.x - e.pageX);
    const moveY = Math.abs(startPoint.y - e.pageY);

    const isClick =
      new Date().getTime() - mouseDownAt < 150 && moveX + moveY < 20;

    if (isClick) return;

    /* NOTE: 빈공간 : placeholder가 보이는 위치로 이동(저장)*/
    const { id: fileId } = file;
    const { id: folderId } = folder;
    // const { row, col } = positionHolder;

    // layoutDB.setItemLayoutById({
    //   id: fileId,
    //   parentId: folderId,
    //   row,
    //   col,
    // });
    await BookmarkApi.move(fileId, folderId);

    flush();
    refreshBookmark();
  };

  return { folderMouseUpHandler };
};

// 모달 => 모달
// 폴더 =>
