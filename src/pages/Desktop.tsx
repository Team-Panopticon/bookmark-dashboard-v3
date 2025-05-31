import { FC, useCallback, useEffect } from "react";
import Bookshelf from "../newtab/components/Bookshelf";
import FolderManager from "../newtab/components/FolderManager";
import ContextMenu from "../newtab/components/ContextMenu";
import { rootStore } from "../newtab/store/rootStore";
import DraggingFile from "../newtab/components/DraggingFile";
import InfoDialog from "../newtab/components/InfoDialog";
import { useEventHandler } from "../newtab/hooks/useEventHandler";
import Search from "../newtab/components/search/Search";
import { layoutDB } from "../newtab/utils/layoutDB";
import BookmarkApi from "../newtab/utils/bookmarkApi";

const DESKTOP_TIMESTAMP_ID = `${Date.now()}`;

const Desktop: FC = () => {
  const { bookmark, refreshBookmark, isDragging } = rootStore();
  const {
    globalEventHandelr: { handleKeyDown, handleMouseUp },
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
    refreshBookmark().then(async () => {
      /*
       * @NOTE: 북마크 삭제에 따른 레이아웃 삭제 기능이 추가된 버전에서 필요한 코드
       * - 북마크 삭제에 따른 레이아웃 삭제 기능이 추가된 버전의 다음 버전에서는 삭제되어야할 코드
       */
      const layoutMap = await layoutDB.getAllLayout();

      const deleteIdPromises = Object.values(layoutMap).map((item) => {
        return new Promise<string | undefined>((res, rej) =>
          BookmarkApi.getSubTree(item.id)
            .then(() => res(undefined))
            .catch((e) => {
              if (e instanceof Error && "message" in e) {
                if (e.message.includes("Can't find bookmark for id.")) {
                  res(item.id);
                }
              } else {
                rej(e);
              }
            })
        );
      });

      const deletedIds = (await Promise.allSettled(deleteIdPromises))
        .filter((settledResult) => settledResult.status === "fulfilled")
        .map((settledResult) => settledResult.value)
        .filter((id) => id !== undefined);

      deletedIds.forEach((id) => {
        layoutDB.deleteItemLayoutById(id);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleKeyDown, handleMouseUp]);

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
