import { useRef, type FC } from "react";
import { bookshelfModalStore } from "../store/bookshelfModal";
import Bookshelf from "./Bookshelf";
import Moveable from "react-moveable";

const BookshelfModalContainer: FC = () => {
  const { bookshelfModals } = bookshelfModalStore();

  return (
    <div>
      {Object.entries(bookshelfModals).map(([key, value]) => {
        return <BookshelfModal key={key} id={value.id} />;
      })}
    </div>
  );
};

const BookshelfModal = ({ id }: { id: string }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);

  return (
    <div className="container">
      <div
        className="absolute flex size-[500px] flex-col rounded-2xl border bg-neutral-50"
        style={{
          top: "10px",
          left: 0,
        }}
        ref={targetRef}
      >
        <div
          ref={dragTargetRef}
          className="flex h-12 w-full items-center  rounded-t-2xl bg-neutral-300 p-2 hover:border-b"
        >
          HEADER
        </div>
        <Bookshelf id={id} />
      </div>
      <Moveable
        target={targetRef}
        dragTarget={dragTargetRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        startDragRotate={0}
        throttleDragRotate={0}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
      />
    </div>
  );
};

export default BookshelfModalContainer;
