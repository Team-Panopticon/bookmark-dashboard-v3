import { Bookmark } from '../../types/store';
import { GRID_CONTAINER_PADDING, ITEM_HEIGHT, ITEM_WIDTH } from './constant';

// row, col이 DB에 없는 애들의 row, col을 계산해서 DB에 저장해줌 + 스타일 추가 (위치 고정)
const getRowCol = (id: string, elItem: HTMLDivElement, parentId: string) => {
  // parent 로부터의 offsetLeft로 스스로의 row, column 계산
  // parent가 min-height, min-width가 제대로 지정되어 있어야 offsetLeft가 정확한 값
  const { row, col } = caculateRowCol({
    offsetLeft: elItem.offsetLeft,
    offsetTop: elItem.offsetTop,
  });

  return { id, parentId, row, col };
};

export const getRowColUpdatedFiles = ({
  files = [],
  folderId,
  refs,
}: {
  files?: Bookmark[];
  folderId: string;
  refs?: HTMLDivElement[];
}) => {
  return [...(refs || [])].map((el, index) =>
    getRowCol(files[index]?.id, el, folderId)
  );
};

export const getRowColFromMouseEvent = (e: React.MouseEvent) => {
  const { clientX, clientY } = e;
  const { x: bookshelfX, y: bookshelfY } =
    e.currentTarget.getBoundingClientRect();
  const { scrollTop, scrollLeft } = e.currentTarget;

  const { row, col } = caculateRowCol({
    offsetLeft: clientX + scrollLeft - bookshelfX,
    offsetTop: clientY + scrollTop - bookshelfY,
  });

  return { row, col };
};

const caculateRowCol = ({
  offsetLeft,
  offsetTop,
}: {
  offsetLeft: number;
  offsetTop: number;
}) => {
  const col =
    Math.floor((offsetLeft - GRID_CONTAINER_PADDING) / ITEM_WIDTH) + 1;
  const row =
    Math.floor((offsetTop - GRID_CONTAINER_PADDING) / ITEM_HEIGHT) + 1;

  return { row, col };
};
