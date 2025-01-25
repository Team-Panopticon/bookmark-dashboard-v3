import type { FC } from "react";
import { useEffect, useRef } from "react";
import { type Bookmark } from "../../types/store";
import { ITEM_HEIGHT, ITEM_WIDTH } from "../utils/constant";
import BookmarkView from "./BookmarkView";
import { getRowColUpdatedFiles } from "../utils/getRowColUpdatedFiles";
import { useEventHandler } from "../hooks/useEventHandler";
import { rootStore } from "../store/rootStore";

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
};

const Bookshelf: FC<Props> = ({ folder, navigateTo }) => {
  const { children: files = [] } = folder;
  const {
    updateFilesLayout,
    dragAndDrop = {},
    focus: { focusedIds },
  } = rootStore();
  const { bookmark: draggingFile } = dragAndDrop;

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

  useEffect(() => {
    updateFilesLayout(
      getRowColUpdatedFiles(
        folder,
        originGridContainerRef.current?.children as HTMLDivElement[] | undefined
      )
    );
  }, [originGridContainerRef.current?.children]);

  return (
    <div
      className="relative grid size-full overflow-y-auto p-gridContainerPadding"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${ITEM_WIDTH}px)`,
        gridAutoRows: `${ITEM_HEIGHT}px`,
      }}
      ref={originGridContainerRef}
      onMouseUp={handleMouseUpBookshelf}
      onMouseDown={handleMouseDownBookshelf}
    >
      {files.map((file) => {
        return (
          <BookmarkView
            key={file.id}
            bookmark={file}
            focused={focusedIds.has(file.id)}
            onMouseDown={(e) =>
              handleMouseDownBookmark({
                event: e,
                bookmark: file,
              })
            }
            onMouseUp={(e) => {
              // TODO: 동작 확인 필요, 부모 이벤트에 먹힘
              console.log("fileview mouse up");
              handleMouseUpBookmark(e, file);
            }}
            onDoubleClick={handleDoubleClickBookmark}
            style={{
              background: draggingFile?.id === file.id ? "#eee" : "",
            }}
          />
        );
      })}
    </div>
  );
};

export default Bookshelf;
