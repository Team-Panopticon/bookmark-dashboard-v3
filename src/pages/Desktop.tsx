import { FC, useCallback, useEffect } from "react";
import { refreshTargetStore } from "../newtab/store/refreshTarget";
import { Item } from "../types/store";
import Bookshelf from "../newtab/components/Bookshelf";

const Desktop: FC = () => {
  const { updateRecentRefreshTimes } = refreshTargetStore();

  const setBookmarksEventHandlers = useCallback(() => {
    chrome.bookmarks.onCreated.addListener((_, bookmark: Item) => {
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

  return (
    <div className="size-full">
      <Bookshelf id="1"></Bookshelf>
      {/* <CreateFolderModal></CreateFolderModal> */}
      {/* <BookshelfModalContainer></BookshelfModalContainer> */}
      {/* <ContextMenuContainer /> */}
      {/* <UpdateModal /> */}
      {/* <Tooltip /> */}
    </div>
  );
};

export default Desktop;
