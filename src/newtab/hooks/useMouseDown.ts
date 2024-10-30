import { Bookshelf, File } from "../../types/store";
import { dragAndDropStore } from "../store/dragAndDrop";

export const useMouseDown = ({ bookshelf }: { bookshelf: Bookshelf }) => {
  const {
    setFile,
    setFileElement,
    setBookshelfAtMouseDown,
    setBookshelfAtMouseMove,
    setMouseDownAt,
    setStartPoint,
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
  };

  return { mouseDownHandler };
};
