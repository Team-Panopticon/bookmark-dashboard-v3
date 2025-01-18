import { Point } from "../../types/Point";
import { Bookshelf, File, FileType } from "../../types/store";
import contextMenuStore from "../store/contextMenuStore";
import { dragAndDropStore } from "../store/dragAndDrop";
import focusStore from "../store/focusStore";

const MOUSE_CLICK = {
  LEFT: 0,
  RIGHT: 2,
} as const;

export const useMouseDown = ({ bookshelf }: { bookshelf: Bookshelf }) => {
  const {
    setFile,
    setFileElement,
    setBookshelfAtMouseDown,
    setMouseDownAt,
    setStartPoint,
    setOffsetBetweenStartPointAndFileLeftTop,
  } = dragAndDropStore();

  const { addFocus, clearFocus } = focusStore();

  const { openMenu } = contextMenuStore();

  const mouseDownHandler = ({
    event,
    file,
    point,
  }: {
    event: React.MouseEvent<HTMLElement, MouseEvent>;
    file: File;
    point: { x: number; y: number };
  }) => {
    event.stopPropagation();
    const { currentTarget, ctrlKey, shiftKey } = event;
    console.log("mousedown >> ", file, event);

    // 멀티 포커스인 경우는 기존 포커스 유지
    if (!(ctrlKey || shiftKey)) {
      clearFocus();
    }

    // 공통
    setFile(file);

    addFocus([file.id]);
    // 우클릭
    if (event.button === MOUSE_CLICK.RIGHT) {
      event.preventDefault();
      openMenu(event.clientX, event.clientY);
      return;
    }
    // move 에 대한 상태관리

    setStartPoint(point);
    setBookshelfAtMouseDown(bookshelf);
    setFileElement(currentTarget);
    setMouseDownAt(Date.now());
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
