import {FC, useCallback, useEffect} from "react";
import Bookshelf from "../newtab/components/Bookshelf";
import FolderManager from "../newtab/components/FolderManager";
import ContextMenu from "../newtab/components/ContextMenu";
import {rootStore} from "../newtab/store/rootStore";
import DraggingFile from "../newtab/components/DraggingFile";
import InfoDialog from "../newtab/components/InfoDialog";
import {useEventHandler} from "../newtab/hooks/useEventHandler";
import Search from "../newtab/components/search/Search";

const DESKTOP_TIMESTAMP_ID = `${Date.now()}`;

const Desktop: FC = () => {
  const {bookmark, refreshBookmark, isDragging} = rootStore();
  const {
    globalEventHandelr: {handleKeyDown},
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
    refreshBookmark();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="size-full">
      {isDragging() && <DraggingFile />}
      {bookmark && (
        <Bookshelf
          folder={bookmark}
          timestamp={DESKTOP_TIMESTAMP_ID}
        ></Bookshelf>
      )}
      <FolderManager />
      <ContextMenu />
      <InfoDialog />
      <Search />
    </div>
  );
};

export default Desktop;
