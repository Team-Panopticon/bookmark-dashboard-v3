import {FC, useCallback, useEffect} from "react";
import Bookshelf from "../newtab/components/Bookshelf";
import FolderManager from "../newtab/components/FolderManager";
import ContextMenu from "../newtab/components/ContextMenu";
import {rootStore} from "../newtab/store/rootStore";
import DraggingFile from "../newtab/components/DraggingFile";
import Search from "../newtab/components/search/Search";
import {useEventHandler} from "../newtab/hooks/useEventHandler";
import InfoDialog from "../newtab/components/InfoDialog";

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
    <div
      className="size-full"
      style={{
        backgroundImage: "url(catalina.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {isDragging() && <DraggingFile />}
      {bookmark && (
        <Bookshelf
          folder={bookmark}
          timestamp={DESKTOP_TIMESTAMP_ID}
          isDesktop={true}
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
