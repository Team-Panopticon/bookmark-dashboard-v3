import { MouseEventHandler, useLayoutEffect } from "react";
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

export const useMouseMove = (bookshelf: Bookshelf) => {
  const {
    fileElement,
    setBookshelfAtMouseMove,
    offsetBetweenStartPointAndFileLeftTop,
  } = dragAndDropStore();

  const mouseMoveHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!fileElement || !offsetBetweenStartPointAndFileLeftTop) return;

    setBookshelfAtMouseMove(bookshelf);

    fileElement.style.position = "absolute";
    fileElement.style.left = `${
      event.pageX - offsetBetweenStartPointAndFileLeftTop.x
    }px`;
    fileElement.style.top = `${
      event.pageY - offsetBetweenStartPointAndFileLeftTop.y
    }px`;

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

    // if(row, col이 달라진 경우){
    //     setState();
    // }
  };
  return { mouseMoveHandler };
};
