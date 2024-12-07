import { Point } from "../../types/Point";
import { Bookshelf, File } from "../../types/store";
import { dragAndDropStore } from "../store/dragAndDrop";

export const useMouseDown = ({ bookshelf }: { bookshelf: Bookshelf }) => {
  const {
    setFile,
    setFileElement,
    setBookshelfAtMouseDown,
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
    console.log("mousedown >> ", file);
    setFile(file);
    setBookshelfAtMouseDown(bookshelf);
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
