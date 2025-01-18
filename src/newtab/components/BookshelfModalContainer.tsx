import { useRef, useState, type FC } from "react";
import { folderStore } from "../store/folder";
import Bookshelf from "./Bookshelf";
import Moveable from "react-moveable";
import { Bookmark } from "../../types/store";
import { bookmarkStore } from "../store/bookmarkStore";

const FolderManager: FC = () => {
  const { folders } = folderStore();

  return (
    <div>
      {Object.entries(folders).map(([timestampId, value]) => {
        return (
          <Folder
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

const Folder = ({
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
  const { closeFolder, focusFolder } = folderStore();
  const folder = bookmarkStore().getSubtree(id);

  /**
   * @TODO
   * BookshelfModal에서 북마크에 대한 정보를 가지고 있어야함.
   *    - 모달에서 헤더를 그리고 있는데 자기 자신의 title도 모름
   * action layout drag&drop -> 부모에서 가져야할 것과 자식이 가져야할 것을 나눈다.
   *
   * 1. Chrome bookmark api를 사용하는 곳을 부모 컴포넌트(BookshelfModal)로 옮긴다.
   * 2. 자식 컴포넌트(ex. Bookshelf)는 받아온 데이터를 가지고 layout, drag&drop, action을 처리한다.
   */

  const [folderItems, setFolderItems] = useState<Bookmark[]>([]);
  const bookshelfId = folderItems[folderItems.length - 1]?.id || id;
  // folderRoute(): BreadCrumb[] {
  //   return this.folderItems.map((item) => ({
  //     disabled: false,
  //     text: item.title,
  //     "data-id": item.id,
  //   }));
  // },
  const routeInFolder = (bookmark: Bookmark) => {
    setFolderItems((prev) => [...prev, bookmark]);
    // 해줘야하는가?
    // await this.routePathRefresh();
  };

  return (
    <div className="container">
      <div
        onMouseDown={() => {
          focusFolder(timestampId);
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
              closeFolder(timestampId);
            }}
            className="aspect-square size-4 rounded-full bg-red-500 text-center text-[10px]"
          ></button>
        </div>
        {folder && <Bookshelf folder={folder} />}
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

export default FolderManager;
