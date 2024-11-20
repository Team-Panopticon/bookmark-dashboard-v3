import { FC, useCallback, useEffect, useState } from "react";
import { refreshTargetStore } from "../newtab/store/refreshTarget";
import { File } from "../types/store";
import Bookshelf from "../newtab/components/Bookshelf";
import FolderManager from "../newtab/components/FolderManager";
import { useFolder } from "../newtab/hooks/useBookshelfLayout";
import { dragAndDropStore } from "../newtab/store/dragAndDrop";
import FileView from "../newtab/components/FileView";

const Desktop: FC = () => {
  const { updateRecentRefreshTimes } = refreshTargetStore();
  const { folder } = useFolder("1");

  const setBookmarksEventHandlers = useCallback(() => {
    chrome.bookmarks.onCreated.addListener((_, bookmark: File) => {
      const { parentId } = bookmark;
      parentId && updateRecentRefreshTimes([parentId]);
    });
    chrome.bookmarks.onRemoved.addListener(
      (_, removeInfo: chrome.bookmarks.BookmarkRemoveInfo) => {
        const { parentId } = removeInfo;
        updateRecentRefreshTimes([parentId]);
      }
    );
    chrome.bookmarks.onMoved.addListener(
      (_, moveInfo: chrome.bookmarks.BookmarkMoveInfo) => {
        const { parentId, oldParentId } = moveInfo;
        updateRecentRefreshTimes([parentId, oldParentId]);
      }
    );
  }, [updateRecentRefreshTimes]);

  useEffect(() => {
    setBookmarksEventHandlers();
  }, [setBookmarksEventHandlers]);

  const { isDragging } = dragAndDropStore();
  return (
    <div className="size-full">
      {isDragging() && <DraggingFile />}
      {folder && <Bookshelf id="1" key={1} folder={folder}></Bookshelf>}
      {/* <CreateFolderModal></CreateFolderModal> */}
      <FolderManager />
      {/* <ContextMenuContainer /> */}
      {/* <UpdateModal /> */}
      {/* <Tooltip /> */}
    </div>
  );
};

export default Desktop;

const DraggingFile = () => {
  const { fileElement, offsetBetweenStartPointAndFileLeftTop, file } =
    dragAndDropStore();

  const [{ x, y }, setDraggingFilePosition] = useState<{
    x?: number;
    y?: number;
  }>({ x: undefined, y: undefined });

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!fileElement || !offsetBetweenStartPointAndFileLeftTop) return;

      setDraggingFilePosition({
        x: event.pageX - offsetBetweenStartPointAndFileLeftTop.x,
        y: event.pageY - offsetBetweenStartPointAndFileLeftTop.y,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!fileElement || !offsetBetweenStartPointAndFileLeftTop) return;

      setDraggingFilePosition({
        x: event.pageX - offsetBetweenStartPointAndFileLeftTop.x,
        y: event.pageY - offsetBetweenStartPointAndFileLeftTop.y,
      });
    };

    const handleMouseUp = () => {
      setDraggingFilePosition({
        x: undefined,
        y: undefined,
      });

      document.removeEventListener("mousedown", handleMouseDown);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [fileElement, offsetBetweenStartPointAndFileLeftTop]);

  if (!file) return null;
  if (x === undefined && y === undefined) return null;

  console.debug("dragging file", x, y);

  return (
    <FileView
      file={file}
      style={{
        position: "absolute",
        top: y,
        left: x,
      }}
    />
  );
};
