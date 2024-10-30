import { MouseEventHandler } from "react";
import { dragAndDropStore } from "../store/dragAndDrop";

interface Point {
  x: number;
  y: number;
}

function getOffsetBetweenPoints(p1: Point, p2: Point) {
  return {
    x: Math.abs(p1.x - p2.x),
    y: Math.abs(p1.y - p2.y),
  };
}

export const useMouseMove = () => {
  const { fileElement, startPoint } = dragAndDropStore();

  const fileElementPoint = fileElement?.getBoundingClientRect() || {
    x: 0,
    y: 0,
  };

  const mouseMoveHandler: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!fileElement || !startPoint) return;

    const offsetBetweenStartPointAndFileLeftTop = getOffsetBetweenPoints(
      startPoint,
      fileElementPoint
    );

    fileElement.style.position = "absolute";
    fileElement.style.left = `${
      event.pageX - offsetBetweenStartPointAndFileLeftTop.x
    }px`;
    fileElement.style.top = `${
      event.pageY - offsetBetweenStartPointAndFileLeftTop.y
    }px`;
  };
  return { mouseMoveHandler };
};
