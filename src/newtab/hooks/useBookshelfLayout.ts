import { Item } from "../../types/store";
import BookmarkApi from "../utils/bookmarkApi";
import { GRID_CONTAINER_PADDING } from "../utils/constant";
import { layoutDB } from "../utils/layoutDB";
import { refreshTargetStore } from "../store/refreshTarget";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  id: string;
  /** Vue의 Ref를 사용해서 넘겨주고 있었음 */
  itemRefs: HTMLDivElement[];
}

const appendLayoutData = async (folderItem: Item): Promise<Item> => {
  const layoutData = await layoutDB.getLayout(folderItem.id);
  folderItem.children?.forEach((item: Item) => {
    const { row, col } = layoutData[item.id] ?? {};
    item.row = row;
    item.col = col;
    item.type = item.children ? "FOLDER" : "FILE";
  });

  return folderItem;
};

export const useBookshelfLayout = (props: Props) => {
  const {
    id,
    /** @TODO folder을 주입받을지, 여기서 생성해서 관리할지, Store로 만들지 고민 필요 */
    itemRefs,
  } = props;
  const { recentRefreshTimes } = refreshTargetStore();
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date().getTime());
  const [folderItem, setFolderItem] = useState<Item>();

  /**
   * Data
   */
  const recentRefreshTime = recentRefreshTimes.get(id);

  const refresh = async () => {
    const subTree = await BookmarkApi.getSubTree(id);
    setFolderItem(await appendLayoutData(subTree));
  };

  useEffect(() => {
    if (recentRefreshTime && recentRefreshTime !== lastRefreshTime) {
      setLastRefreshTime(recentRefreshTime);
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentRefreshTime]);

  useEffect(() => {
    (async () => {
      await refresh();
      itemRefs.forEach(setRowCol);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // row, col이 DB에 없는 애들의 row, col을 계산해서 DB에 저장해줌 + 스타일 추가 (위치 고정)
  const setRowCol = async (elItem: HTMLDivElement) => {
    const id = elItem.dataset.id as string;
    const itemLayout = await layoutDB.getItemLayoutById(id);

    if (itemLayout) {
      return;
    }

    const itemWidth = elItem.offsetWidth;
    const itemHeight = elItem.offsetHeight;

    // parent 로부터의 offsetLeft로 스스로의 row, column 계산
    // parent가 min-height, min-width가 제대로 지정되어 있어야 offsetLeft가 정확한 값
    const col =
      Math.floor((elItem.offsetLeft - GRID_CONTAINER_PADDING) / itemWidth) + 1;
    const row =
      Math.floor((elItem.offsetTop - GRID_CONTAINER_PADDING) / itemHeight) + 1;

    // 저장된 초기 row, col 값을 folderItem에 반영
    const originalItem: Item | undefined = folderItem?.children?.find(
      (item) => item.id === id
    );

    if (!originalItem) {
      return;
    }

    const parentId = originalItem.parentId as string;

    // row column이 Infinity일 경우 Auto로 셋팅, 아닐경우 DB에 삽입
    if (row === -Infinity || col === -Infinity) {
      originalItem.row = "auto";
      originalItem.col = "auto";
    } else {
      layoutDB.setItemLayoutById({ id, parentId, row, col });
      // 저장된 초기 row, col 값을 folderItem에 반영
      originalItem.row = row;
      originalItem.col = col;
    }
  };

  return {
    folderItem,
    setFolderItem,
  };
};
