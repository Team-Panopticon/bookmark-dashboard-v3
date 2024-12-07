import { create } from "zustand";
import { Bookshelf, File } from "../../types/store";

/**
 * 1. File에 대한 정보
 *    - id, 등도
 *    - HTMLElement
 * 2. 최초의 bookshelf
 *    - 다른 bookshelf든 혹은 본인이든 bookmark위에 드래그가 된 경우에 placeHolder가 최초 위치에 가야한다.
 * 3. 현재 bookshelf
 *
 *
 * 3. placeholder HTMLElement -> 복사해서 -> 각 bookshelf의 로컬 상태와 연결시키는게 좋은가? placeholder옮겨다니는데 옮길때마다 bookshelf의 dom에 넣어줘야함. {boolean && <PlaceHolder position={position}/>} mousemove => position state change
 * 3. placeHolder를 최상단에두고 abosolute로 제어하는데 -> top, left -> 특정 범위 내 -> col,row에 위치에 고정되어있어야함
 * (필수) 현재 마우스 포인터에 대한 위치를 알아야하고, 그게 현재 bookshelf에서 어느 위치에 있는지 알아야함 -> mousemove point x,y pageX,pageY file width, height -> 실제 col, row
 */

export type State = {
  file?: File;
  fileElement?: HTMLElement;
  mouseDownAt?: number;
  bookshelfAtMouseDown?: Bookshelf;
  startPoint?: { x: number; y: number };
  offsetBetweenStartPointAndFileLeftTop?: { x: number; y: number };
};

export interface Actions {
  isDragging: () => boolean;
  setFile: (file: File) => void;
  setFileElement: (element: HTMLElement) => void;
  setBookshelfAtMouseDown: (bookshelf: Bookshelf) => void;
  setMouseDownAt: (time: number) => void;
  setStartPoint: (point: { x: number; y: number }) => void;
  setOffsetBetweenStartPointAndFileLeftTop: (point: {
    x: number;
    y: number;
  }) => void;
  flush: () => void;
}

export const dragAndDropStore = create<State & Actions>((set, get) => ({
  isDragging: () => Boolean(get().file),
  setFile: (file: File) => set({ file }),
  setFileElement: (element: HTMLElement) => set({ fileElement: element }),
  setBookshelfAtMouseDown: (bookshelf: Bookshelf) =>
    set({ bookshelfAtMouseDown: bookshelf }),
  setMouseDownAt: (time) => set({ mouseDownAt: time }),
  setStartPoint: ({ x, y }) => set({ startPoint: { x, y } }),
  setOffsetBetweenStartPointAndFileLeftTop: ({ x, y }) =>
    set({ offsetBetweenStartPointAndFileLeftTop: { x, y } }),
  flush: () => {
    set({
      file: undefined,
      fileElement: undefined,
      mouseDownAt: undefined,
      bookshelfAtMouseDown: undefined,
      startPoint: undefined,
      offsetBetweenStartPointAndFileLeftTop: undefined,
    });
  },
}));
