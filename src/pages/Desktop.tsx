import { FC, useCallback, useEffect } from "react";
import Bookshelf from "../newtab/components/Bookshelf";
import FolderManager from "../newtab/components/FolderManager";
import ContextMenu from "../newtab/components/ContextMenu";
import { rootStore } from "../newtab/store/rootStore";
import { useEventHandler } from "../newtab/hooks/useEventHandler";
import DraggingFile from "../newtab/components/DraggingFile";

const DESKTOP_TIMESTAMP_ID = `${Date.now()}`;

const Desktop: FC = () => {
  const { bookmark, refreshBookmark, isDragging } = rootStore();
  const {
    desktopEventHander: { handleMouseDownDesktop },
  } = useEventHandler({});

  const setBookmarksEventHandlers = useCallback(() => {
    chrome.bookmarks.onCreated.addListener(() => {
      refreshBookmark();
    });
    chrome.bookmarks.onRemoved.addListener(() => {
      refreshBookmark();
    });
    chrome.bookmarks.onMoved.addListener(() => {
      refreshBookmark();
    });
  }, [refreshBookmark]);

  useEffect(() => {
    setBookmarksEventHandlers();
  }, [setBookmarksEventHandlers]);

  useEffect(() => {
    refreshBookmark();
  }, [refreshBookmark]);

  return (
    <div className="size-full" onMouseDown={handleMouseDownDesktop}>
      {isDragging() && <DraggingFile />}
      {bookmark && (
        <Bookshelf
          folder={bookmark}
          timestamp={DESKTOP_TIMESTAMP_ID}
        ></Bookshelf>
      )}
      <FolderManager />
      <ContextMenu />
    </div>
  );
};

export default Desktop;
