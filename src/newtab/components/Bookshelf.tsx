import type { FC } from "react";
import { useEffect, useRef } from "react";
import { type Bookmark } from "../../types/store";
import { ITEM_HEIGHT, ITEM_WIDTH } from "../utils/constant";
import { useMouseDown } from "../hooks/useMouseDown";
import { useMouseUp } from "../hooks/useMouseUp";
import { dragAndDropStore } from "../store/dragAndDrop";
import BookmarkView from "./BookmarkView";
import { getRowColUpdatedFiles } from "../utils/getRowColUpdatedFiles";
import { bookmarkStore } from "../store/bookmarkStore";
import { useFolderUp } from "../hooks/useFolderUp";
import focusStore from "../store/focusStore";

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
  const { updateFilesLayout } = bookmarkStore();
  const { bookmark: draggingFile } = dragAndDropStore();
  const { focusedIds, clearFocus } = focusStore();
  const originGridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateFilesLayout(
      getRowColUpdatedFiles(
        folder,
        originGridContainerRef.current?.children as HTMLDivElement[] | undefined
      )
    );
  }, [originGridContainerRef.current?.children]);

  const { mouseDownHandler } = useMouseDown({
    bookshelf: folder,
  });
  const { mouseUpHandler } = useMouseUp({ parentId: folder.id });
  const { folderMouseUpHandler, doubleClickHandler } = useFolderUp({
    navigateTo,
  });

  return (
    <div
      className="relative grid size-full overflow-y-auto p-gridContainerPadding"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${ITEM_WIDTH}px)`,
        gridAutoRows: `${ITEM_HEIGHT}px`,
      }}
      ref={originGridContainerRef}
      onMouseUp={(e) => {
        console.log("Bookshelf mouse up");
        mouseUpHandler(e);
      }}
      onMouseDown={({ ctrlKey, shiftKey }) => {
        console.log("Bookshelf mouse down");
        if (!(ctrlKey || shiftKey)) {
          clearFocus();
        }
      }}
    >
      {files.map((file) => {
        return (
          <BookmarkView
            key={file.id}
            bookmark={file}
            focused={focusedIds.has(file.id)}
            onMouseDown={(e) =>
              mouseDownHandler({
                event: e,
                bookmark: file,
                point: { x: e.pageX, y: e.pageY },
              })
            }
            onMouseUp={(e) => {
              // TODO: 동작 확인 필요, 부모 이벤트에 먹힘
              console.log("fileview mouse up");
              folderMouseUpHandler(e, file);
            }}
            onDoubleClick={doubleClickHandler}
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
