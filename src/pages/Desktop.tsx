import { FC, useCallback, useEffect, useState } from "react";
import Bookshelf from "../newtab/components/Bookshelf";
import FolderManager from "../newtab/components/FolderManager";
import { dragAndDropStore } from "../newtab/store/dragAndDrop";
import FileView from "../newtab/components/FileView";
import { bookmarkStore } from "../newtab/store/bookmarkStore";
import { useFolderUp } from "../newtab/hooks/useFolderUp";
import ContextMenu from "../newtab/components/ContextMenu";

const Desktop: FC = () => {
  const { bookmark, getBookmark } = bookmarkStore();

  const setBookmarksEventHandlers = useCallback(() => {
    chrome.bookmarks.onCreated.addListener(() => {
      getBookmark();
    });
    chrome.bookmarks.onRemoved.addListener(() => {
      getBookmark();
    });
    chrome.bookmarks.onMoved.addListener(() => {
      getBookmark();
    });
  }, [getBookmark]);

  useEffect(() => {
    setBookmarksEventHandlers();
  }, [setBookmarksEventHandlers]);

  useEffect(() => {
    getBookmark();
  }, [getBookmark]);

  const { isDragging } = dragAndDropStore();
  return (
    <div className="size-full">
      {isDragging() && <DraggingFile />}
      {bookmark && <Bookshelf folder={bookmark}></Bookshelf>}
      {/* <CreateFolderModal></CreateFolderModal> */}
      <FolderManager />
      <ContextMenu />
      {/* <UpdateModal /> */}
      {/* <Tooltip /> */}
    </div>
  );
};

export default Desktop;

const DraggingFile = () => {
  // todo : rootStore 에서 값 가져오는걸로 변경
  const { fileElement, offsetBetweenStartPointAndFileLeftTop, file } =
    dragAndDropStore();
  const { folderMouseUpHandler } = useFolderUp({});

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

  return (
    <FileView
      file={file}
      style={{
        position: "absolute",
        top: y,
        left: x,
        zIndex: 99999,
        pointerEvents: "none",
      }}
      onMouseUp={(e) => {
        console.log("draging file mouse up");
        folderMouseUpHandler(e, file);
      }}
    />
  );
};
