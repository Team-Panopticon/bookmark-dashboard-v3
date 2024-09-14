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
            zIndex={value.zIndex}
            timestampId={timestampId}
          />
        );
      })}
    </div>
  );
};

const BookshelfModal = ({
  id,
  zIndex,
  timestampId,
}: {
  id: string;
  zIndex: number;
  timestampId: string;
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const { closeBookshelfModal, focusBookshelfModal } = bookshelfModalStore();

  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const bookshelfId = folderItems[folderItems.length - 1]?.id || id;
  // folderRoute(): BreadCrumb[] {
  //   return this.folderItems.map((item) => ({
  //     disabled: false,
  //     text: item.title,
  //     "data-id": item.id,
  //   }));
  // },
  const routeInFolder = (id: string, title: string) => {
    setFolderItems((prev) => [...prev, { id, title }]);
    // 해줘야하는가?
    // await this.routePathRefresh();
  };

  return (
    <div className="container">
      <div
        onMouseDown={() => {
          focusBookshelfModal(timestampId);
        }}
        className="absolute flex size-[500px] flex-col rounded-lg border bg-neutral-50 shadow-2xl"
        style={{
          top: "10px",
          left: 0,
          maxWidth: "auto",
          maxHeight: "auto",
          minWidth: "auto",
          minHeight: "auto",
          zIndex,
        }}
        ref={targetRef}
      >
        <div
          ref={dragTargetRef}
          className="flex h-12 w-full items-center justify-between rounded-t-lg bg-neutral-300 p-2 hover:border-b "
        >
          <div>{folderItems.map((item) => item.title).join(" / ")}</div>
          <button
            onClick={() => {
              closeBookshelfModal(timestampId);
            }}
            className="aspect-square size-4 rounded-full bg-red-500 text-center text-[10px]"
          ></button>
        </div>
        <Bookshelf
          id={bookshelfId}
          key={bookshelfId}
          routeInFolder={routeInFolder}
        />
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
