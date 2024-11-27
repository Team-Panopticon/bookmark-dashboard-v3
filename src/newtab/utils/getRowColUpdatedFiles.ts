import { File } from "../../types/store";
import { GRID_CONTAINER_PADDING, ITEM_HEIGHT, ITEM_WIDTH } from "./constant";

// row, col이 DB에 없는 애들의 row, col을 계산해서 DB에 저장해줌 + 스타일 추가 (위치 고정)
const getRowCol = (id: string, elItem: HTMLDivElement, parentId: string) => {
  // parent 로부터의 offsetLeft로 스스로의 row, column 계산
  // parent가 min-height, min-width가 제대로 지정되어 있어야 offsetLeft가 정확한 값
  const col =
    Math.floor((elItem.offsetLeft - GRID_CONTAINER_PADDING) / ITEM_WIDTH) + 1;
  const row =
    Math.floor((elItem.offsetTop - GRID_CONTAINER_PADDING) / ITEM_HEIGHT) + 1;

  return { id, parentId, row, col };
};

export const getRowColUpdatedFiles = (
  folder: File,
  refs?: HTMLDivElement[]
) => {
  const { children: files = [], id: parentId } = folder;

  return [...(refs || [])].map((el, index) =>
    getRowCol(files[index]?.id, el, parentId)
  );
};
