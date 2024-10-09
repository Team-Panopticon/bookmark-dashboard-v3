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

interface Props {
  id: string;
  /** Vue의 Ref를 사용해서 넘겨주고 있었음 */
  itemRefs: HTMLDivElement[];
  folder: File;
}

export const useFolder = (id: string) => {
  const [folder, setFolder] = useState<File>(); // -> 부모 // 자식들folderItem
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date().getTime());

  const { recentRefreshTimes } = refreshTargetStore();
  const recentRefreshTime = recentRefreshTimes.get(id);

  const refresh = useCallback(async () => {
    // getSubTree로 id의 아이템과 포함된 id의 서브트리를 가져온다
    const subTree = await BookmarkApi.getSubTree(id);
    setFolder(subTree);
  }, [id]);

  useEffect(() => {
    if (!recentRefreshTime) {
      refresh();
      return;
    }

    if (recentRefreshTime !== lastRefreshTime) {
      setLastRefreshTime(recentRefreshTime);
      refresh();
    }
  }, [recentRefreshTime, lastRefreshTime, refresh]);

  return { folder, files: folder?.children || [] };
};

// row, col이 DB에 없는 애들의 row, col을 계산해서 DB에 저장해줌 + 스타일 추가 (위치 고정)
const setRowCol = async (elItem: HTMLDivElement, folder?: File) => {
  const id = elItem.dataset.id as string;
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

  // 저장된 초기 row, col 값을 folderItem에 반영
  const originalItem: File | undefined = folder?.children?.find(
    (item) => item.id === id
  );

  if (!originalItem) {
    return;
  }

  const parentId = originalItem.parentId as string;

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
  const [_, forceUpdate] = useState(1);
  const { updateRecentRefreshTimes } = refreshTargetStore();
  const files = (folder?.children || []).map((child) => {
    return makeFile(child, layoutMap);
  });

  useEffect(() => {
    [...itemRefs].forEach((el) => setRowCol(el, folder));
    // forceUpdate(Math.random());
    updateRecentRefreshTimes([folder.id]);
  }, [itemRefs]);

  useEffect(() => {
    console.log(folder);
    getLayoutMap(folder).then((map) => setLayoutMap(map));
  }, [folder]);

  const getLayoutMap = async (file: File) => layoutDB.getLayout(file.id);

  return { files };
};
