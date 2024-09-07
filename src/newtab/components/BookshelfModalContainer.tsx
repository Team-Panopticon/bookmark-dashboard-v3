import { useRef, type FC } from "react";
import { bookshelfModalStore } from "../store/bookshelfModal";
import Bookshelf from "./Bookshelf";
import Moveable from "react-moveable";

const BookshelfModalContainer: FC = () => {
  const { bookshelfModals } = bookshelfModalStore();

  return (
    <div>
      {Object.entries(bookshelfModals).map(([timestampId, value]) => {
        return (
          <BookshelfModal
            key={timestampId}
            id={value.id}
            timestampId={timestampId}
          />
        );
      })}
    </div>
  );
};

const BookshelfModal = ({
  id,
  timestampId,
}: {
  id: string;
  timestampId: string;
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const { closeBookshelfModal } = bookshelfModalStore();

  return (
    <div className={"container"}>
      <div
        className="absolute flex size-[500px] flex-col rounded-lg border bg-neutral-50 shadow-2xl"
        style={{
          top: "10px",
          left: 0,
          maxWidth: "auto",
          maxHeight: "auto",
          minWidth: "auto",
          minHeight: "auto",
        }}
        ref={targetRef}
      >
        <div
          ref={dragTargetRef}
          className="flex h-12 w-full items-center justify-between rounded-t-lg bg-neutral-300 p-2 hover:border-b "
        >
          <div>HEADER</div>
          <button
            onClick={() => {
              closeBookshelfModal(timestampId);
            }}
            className="aspect-square size-4 rounded-full bg-red-500 text-center text-[10px]"
          ></button>
        </div>
        <Bookshelf id={id} />
      </div>
      <Moveable
        target={targetRef}
        dragTarget={dragTargetRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        resizable={true}
        startDragRotate={0}
        throttleDragRotate={0}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
        }}
      />
    </div>
  );
};

export default BookshelfModalContainer;
