import { useRef, useState, type FC } from "react";
import { folderStore } from "../store/folder";
import Bookshelf from "./Bookshelf";
import Moveable from "react-moveable";
import { File } from "../../types/store";
import { useFolder } from "../hooks/useBookshelfLayout";
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
  const { getSubtree } = bookmarkStore();
  const folder = getSubtree(id);
  const targetRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const { closeFolder, focusFolder } = folderStore();
  const childItems = folder?.children || [];

  const bookshelfId = childItems[childItems.length - 1]?.id || id;
  // folderRoute(): BreadCrumb[] {
  //   return this.folderItems.map((item) => ({
  //     disabled: false,
  //     text: item.title,
  //     "data-id": item.id,
  //   }));
  // },
  const routeInFolder = (file: File) => {
    // setFolderItems((prev) => [...prev, { id, title }]);
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
          <div>
            {[{ title: "Header" }].map((item) => item.title).join(" / ")}
          </div>
          <button
            onClick={() => {
              closeFolder(timestampId);
            }}
            className="aspect-square size-4 rounded-full bg-red-500 text-center text-[10px]"
          ></button>
        </div>
        {folder && (
          <Bookshelf id={bookshelfId} key={bookshelfId} folder={folder} />
        )}
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
