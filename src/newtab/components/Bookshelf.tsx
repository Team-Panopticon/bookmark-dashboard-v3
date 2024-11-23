import type { FC } from "react";
import { memo, useRef } from "react";
import { type File } from "../../types/store";
import { useFolder, useFolderLayout } from "../hooks/useBookshelfLayout";
import { ITEM_HEIGHT, ITEM_WIDTH } from "../utils/constant";
import { useMouseDown } from "../hooks/useMouseDown";
import { useMouseUp } from "../hooks/useMouseUp";
import { useMouseMove } from "../hooks/useMouseMove";
import { dragAndDropStore } from "../store/dragAndDrop";
import FileView from "./FileView";

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
  id: string;
  folder: File;
  routeInFolder?: (file: File) => void;
};

const Bookshelf: FC<Props> = (props) => {
  const { folder } = props;

  const { file: draggingFile } = dragAndDropStore();

  const originGridContainerRef = useRef<HTMLDivElement>(null);

  const { files } = useFolderLayout(
    folder,
    (originGridContainerRef.current?.children as unknown as HTMLDivElement[]) ||
      []
  );

  const { mouseDownHandler } = useMouseDown({
    bookshelf: folder,
  });
  const { mouseUpHandler } = useMouseUp();
  const { mouseMoveHandler, isDraggingOn, positionHolder } =
    useMouseMove(folder);

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
      onMouseMove={mouseMoveHandler}
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
          />
        );
      })}
      {isDraggingOn && draggingFile && positionHolder && (
        <PositionHolder
          file={draggingFile}
          col={positionHolder.col}
          row={positionHolder.row}
        />
      )}
    </div>
  );
};

const PositionHolder = ({
  file,
  row,
  col,
}: {
  file: File;
  row: File["row"];
  col: File["col"];
}) => {
  return (
    <FileView
      style={{ opacity: 0.6 }}
      key={file.id}
      file={{ ...file, row, col }}
    />
  );
};

export default memo(Bookshelf);
