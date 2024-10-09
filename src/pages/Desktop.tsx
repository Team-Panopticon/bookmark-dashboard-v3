import { FC, useCallback, useEffect } from "react";
import { refreshTargetStore } from "../newtab/store/refreshTarget";
import { File } from "../types/store";
import Bookshelf from "../newtab/components/Bookshelf";
import FolderManager from "../newtab/components/FolderManager";
import { useFolder } from "../newtab/hooks/useBookshelfLayout";

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

  return (
    <div className="size-full">
      {folder && <Bookshelf id="1" folder={folder}></Bookshelf>}
      {/* <CreateFolderModal></CreateFolderModal> */}
      <FolderManager></FolderManager>
      {/* <ContextMenuContainer /> */}
      {/* <UpdateModal /> */}
      {/* <Tooltip /> */}
    </div>
  );
};

export default Desktop;
