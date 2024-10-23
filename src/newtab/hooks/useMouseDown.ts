import { Bookshelf, File } from "../../types/store";
import { dragAndDropStore } from "../store/dragAndDrop";

export const useMouseDown = ({ bookshelf }: { bookshelf: Bookshelf }) => {
  const {
    setFile,
    setFileElement,
    setBookshelfAtMouseDown,
    setBookshelfAtMouseMove,
    setMouseDownAt,
  } = dragAndDropStore();

  const mouseDownHandler = ({
    currentTarget,
    file,
  }: {
    currentTarget: HTMLElement;
    file: File;
  }) => {
    setFile(file);
    setBookshelfAtMouseDown(bookshelf);
    setBookshelfAtMouseMove(bookshelf);
    setFileElement(currentTarget);
    setMouseDownAt(Date.now());
  };

  return { mouseDownHandler };
};
