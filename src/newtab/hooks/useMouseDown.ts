import { Bookshelf, File } from "../../types/store";
import { dragAndDropStore } from "../store/dragAndDrop";
import { Point } from "./useMouseMove";

export const useMouseDown = ({ bookshelf }: { bookshelf: Bookshelf }) => {
  const {
    setFile,
    setFileElement,
    setBookshelfAtMouseDown,
    setBookshelfAtMouseMove,
    setMouseDownAt,
    setStartPoint,
    setOffsetBetweenStartPointAndFileLeftTop,
  } = dragAndDropStore();

  const mouseDownHandler = ({
    currentTarget,
    file,
    point,
  }: {
    currentTarget: HTMLElement;
    file: File;
    point: { x: number; y: number };
  }) => {
    setFile(file);
    setBookshelfAtMouseDown(bookshelf);
    setBookshelfAtMouseMove(bookshelf);
    setFileElement(currentTarget);
    setMouseDownAt(Date.now());
    setStartPoint(point);
    const offsetBetweenStartPointAndFileLeftTop = getOffsetBetweenPoints(
      point,
      currentTarget?.getBoundingClientRect()
    );
    setOffsetBetweenStartPointAndFileLeftTop(
      offsetBetweenStartPointAndFileLeftTop
    );
  };

  return { mouseDownHandler };
};

function getOffsetBetweenPoints(p1: Point, p2: Point) {
  return {
    x: Math.abs(p1.x - p2.x),
    y: Math.abs(p1.y - p2.y),
  };
}
