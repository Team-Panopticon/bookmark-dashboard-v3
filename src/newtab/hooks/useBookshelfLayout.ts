import { File, FileType } from "../../types/store";
import BookmarkApi from "../utils/bookmarkApi";
import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "../utils/constant";
import { layoutDB, LayoutMap } from "../utils/layoutDB";
import { refreshTargetStore } from "../store/refreshTarget";
import { useCallback, useEffect, useState } from "react";

export const useFolder = (id: string) => {
  const [folder, setFolder] = useState<File>(); // -> 부모 // 자식들folderItem

  const refresh = useCallback(async () => {
    // getSubTree로 id의 아이템과 포함된 id의 서브트리를 가져온다
    const subTree = await BookmarkApi.getSubTree(id);
    setFolder(subTree);
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { folder, files: folder?.children || [], refresh };
};

// row, col이 DB에 없는 애들의 row, col을 계산해서 DB에 저장해줌 + 스타일 추가 (위치 고정)
const setRowCol = async (id: string, elItem: HTMLDivElement, folder: File) => {
  const parentId = folder.id;
  const itemLayout = await layoutDB.getItemLayoutById(id);

  if (itemLayout) {
    return;
  }

  // parent 로부터의 offsetLeft로 스스로의 row, column 계산
  // parent가 min-height, min-width가 제대로 지정되어 있어야 offsetLeft가 정확한 값
  const col =
    Math.floor((elItem.offsetLeft - GRID_CONTAINER_PADDING) / ITEM_WIDTH) + 1;
  const row =
    Math.floor((elItem.offsetTop - GRID_CONTAINER_PADDING) / ITEM_HEIGHT) + 1;

  layoutDB.setItemLayoutById({ id, parentId, row, col });
};

const makeFile = (
  bookmarkNode: chrome.bookmarks.BookmarkTreeNode,
  layoutMap?: LayoutMap
): File => {
  if (!layoutMap) {
    return bookmarkNode;
  }

  const { row, col } = layoutMap[bookmarkNode.id] || {};

  return {
    ...bookmarkNode,
    row,
    col,
    type: bookmarkNode.children ? FileType.FOLDER : FileType.BOOKMARK,
  };
};

export const useFolderLayout = (folder: File, itemRefs: HTMLDivElement[]) => {
  const [layoutMap, setLayoutMap] = useState<LayoutMap>();
  const { updateRecentRefreshTimes, recentRefreshTimes } = refreshTargetStore();
  const files = (folder?.children || []).map((child) => {
    return makeFile(child, layoutMap);
  });

  useEffect(() => {
    [...itemRefs].forEach((el, index) =>
      setRowCol(files[index]?.id, el, folder)
    );

    /**
     * @TODO: dependency 배열에 files, folder가 있으면 updateRecentRefreshTimes가 돌면서 또 files, folder가 업데이트 되면서 무한루프.
     * 로직의 수정이 필요.
     */
    updateRecentRefreshTimes([folder.id]);
  }, [itemRefs]);

  useEffect(() => {
    getLayoutMap(folder).then((map) => setLayoutMap(map));
  }, [folder]);

  const getLayoutMap = async (file: File) => layoutDB.getLayout(file.id);

  return { files };
};
