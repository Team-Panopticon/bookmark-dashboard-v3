import type { FC } from "react";
import { useEffect, useMemo, useRef } from "react";
import { type Bookmark } from "../../types/store";
import { ITEM_HEIGHT, ITEM_WIDTH } from "../utils/constant";
import BookmarkView from "./BookmarkView";
import { getRowColUpdatedFiles } from "../utils/getRowColUpdatedFiles";
import { useEventHandler } from "../hooks/useEventHandler";
import { rootStore } from "../store/rootStore";
import BookmarkApi from "../utils/bookmarkApi";

export interface DarkModeEvent {
  darkMode: boolean;
}

// eslint-disable-next-line
export const isDarkModeEvent = (event: any): event is DarkModeEvent => {
  if (typeof event?.darkMode === "boolean") {
    return true;
  }
  return false;
};

type Props = {
  folder: Bookmark;
  navigateTo?: (bookmark: Bookmark) => void;
  timestamp: string;
  isDesktop?: boolean;
};

const Bookshelf: FC<Props> = ({ folder, navigateTo, timestamp, isDesktop }) => {
  const { children: files = [] } = folder;
  const {
    updateFilesLayout,
    dragAndDrop = {},
    focus: { focusedIds, focusCursor },
    refreshBookmark,
    edit,
    setEdit,
  } = rootStore();
  const { bookmark: draggingFile, timestamp: draggingFileTimestamp } =
    dragAndDrop;

  const originGridContainerRef = useRef<HTMLDivElement>(null);

  const {
    bookmarkEventHandler: {
      handleDoubleClickBookmark,
      handleMouseDownBookmark,
      handleMouseUpBookmark,
    },
    bookshelfEventHandler: { handleMouseDownBookshelf, handleMouseUpBookshelf },
  } = useEventHandler({
    bookshelf: folder,
    navigateTo,
  });

  const handleSave = async (id: string, title: string) => {
    // updateTitle
    await BookmarkApi.updateTitle(id, title);
    await refreshBookmark();
  };

  const folderRef = useRef(folder);

  useEffect(() => {
    folderRef.current = folder;
  }, [folder]);

  const folderChildrenLength = useMemo(() => {
    return folder.children?.length;
  }, [folder]);

  useEffect(() => {
    updateFilesLayout(
      getRowColUpdatedFiles({
        files: folderRef.current.children,
        folderId: folderRef.current.id,
        refs: originGridContainerRef.current?.children as
          | HTMLDivElement[]
          | undefined,
      })
    );
  }, [folderChildrenLength, updateFilesLayout]);

  return (
    <div
      className="relative grid size-full overflow-y-auto p-gridContainerPadding"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${ITEM_WIDTH}px)`,
        gridAutoRows: `${ITEM_HEIGHT}px`,
        backgroundImage: folder.id === "1" ? "transparent" : "white",
      }}
      ref={originGridContainerRef}
      onMouseUp={handleMouseUpBookshelf}
      onMouseDown={(e) => handleMouseDownBookshelf(e, folder)}
    >
      {files.map((file) => {
        const timestampId = `${timestamp}_${file.id}`;
        const draggingFileTimestampId = `${draggingFileTimestamp}_${draggingFile?.id}`;
        const isFoscused = focusedIds.has(timestampId);
        const isDragging = draggingFileTimestampId === timestampId;
        const isCurrentFocusCursor =
          focusCursor?.currentBookshelf === timestamp &&
          file.id === focusCursor?.targetId;

        const isEdit = edit.timestampId === timestampId;

        return (
          <BookmarkView
            key={timestampId}
            isDesktop={isDesktop}
            bookmark={file}
            focused={isFoscused}
            isCurrentFocusCursor={isCurrentFocusCursor}
            onSave={async (title) => handleSave(file.id, title)}
            onMouseDown={(e) =>
              handleMouseDownBookmark({
                event: e,
                bookmark: file,
                timestamp,
              })
            }
            onMouseUp={(e) => {
              // TODO: 동작 확인 필요, 부모 이벤트에 먹힘
              handleMouseUpBookmark(e, file);
            }}
            onDoubleClick={handleDoubleClickBookmark}
            style={{
              boxShadow: isDragging ? " rgba(0, 0, 0, 0.04) 0px 3px 5px;" : "",
            }}
            isEdit={isEdit}
            setIsEdit={(newIsEdit) => {
              if (newIsEdit) {
                setEdit(timestampId);
              } else {
                setEdit(null);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default Bookshelf;
