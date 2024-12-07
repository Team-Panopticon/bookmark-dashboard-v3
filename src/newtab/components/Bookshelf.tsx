import type { FC } from "react";
import { useEffect, useRef } from "react";
import { type File } from "../../types/store";
import { ITEM_HEIGHT, ITEM_WIDTH } from "../utils/constant";
import { useMouseDown } from "../hooks/useMouseDown";
import { useMouseUp } from "../hooks/useMouseUp";
import { dragAndDropStore } from "../store/dragAndDrop";
import FileView from "./FileView";
import { getRowColUpdatedFiles } from "../utils/getRowColUpdatedFiles";
import { bookmarkStore } from "../store/bookmarkStore";
import { useFolderUp } from "../hooks/useFolderUp";

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
  folder: File;
  routeInFolder?: (file: File) => void;
};

const Bookshelf: FC<Props> = ({ folder }) => {
  const { children: files = [] } = folder;
  const { updateFilesLayout } = bookmarkStore();
  const { file: draggingFile } = dragAndDropStore();

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
  const { folderMouseUpHandler } = useFolderUp();

  return (
    <div
      className="relative grid size-full overflow-y-auto p-gridContainerPadding"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${ITEM_WIDTH}px)`,
        gridAutoRows: `${ITEM_HEIGHT}px`,
      }}
      ref={originGridContainerRef}
      onMouseUp={(e) => {
        mouseUpHandler(e);
      }}
    >
      {files.map((file) => {
        if (draggingFile?.id === file.id) return;

        return (
          <FileView
            key={file.id}
            file={file}
            onMouseDown={(e) =>
              mouseDownHandler({
                currentTarget: e.currentTarget,
                file,
                point: { x: e.pageX, y: e.pageY },
              })
            }
            onMouseUp={(e) => {
              // TODO: 동작 확인 필요, 부모 이벤트에 먹힘
              folderMouseUpHandler(e, file);
            }}
          />
        );
      })}
    </div>
  );
};

export default Bookshelf;
