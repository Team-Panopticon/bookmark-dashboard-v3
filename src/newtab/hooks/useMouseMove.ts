import { MouseEventHandler, useState } from "react";
import { dragAndDropStore } from "../store/dragAndDrop";
import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "../utils/constant";
import { Bookshelf } from "../../types/store";

export interface Point {
  x: number;
  y: number;
}

/**
 * @TODO: 241102
 * 목표: store에서 fileElement 지우기
 *
 * React 컴포넌트를 이용해서 file 데이터를 기준으로 새로운 컴포넌트를 만들어서 마우스 포인트에 붙을 수 있도록 한다.
 * 원래 있던 파일은, 지우던지 filter 해주던지....
 *   - 기존 위치로 돌아가는 경우에는 어떻게 처리?
 *     refrehsh 하면 되지 않을까...????
 * placeHodler & 드래깅중인 file을 새로 만든걸로 한다
 */

export const useMouseMove = (bookshelf: Bookshelf) => {
  const {
    fileElement,
    bookshelfAtMouseMove,
    setBookshelfAtMouseMove,
    offsetBetweenStartPointAndFileLeftTop,
    isDragging,
    positionHolder,
    setPositionHolder,
  } = dragAndDropStore();

  const mouseMoveHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!fileElement || !offsetBetweenStartPointAndFileLeftTop) return;

    setBookshelfAtMouseMove(bookshelf);
    const { clientX, clientY } = event;
    const { x: bookshelfX, y: bookshelfY } =
      event.currentTarget.getBoundingClientRect();
    const { scrollTop, scrollLeft } = event.currentTarget;

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

    if (positionHolder?.row !== row || positionHolder?.col !== col) {
      setPositionHolder({
        row,
        col,
      });
    }
  };

  const isDraggingOn =
    isDragging() && bookshelfAtMouseMove?.id === bookshelf.id;

  return { mouseMoveHandler, isDraggingOn, positionHolder };
};
