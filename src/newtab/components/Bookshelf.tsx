import type { FC } from "react";
import { useRef } from "react";
import { type File } from "../../types/store";
import { useFolderLayout } from "../hooks/useBookshelfLayout";
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

  const { fileElement, isDragging, file: draggingFile } = dragAndDropStore();

  const originGridContainerRef = useRef<HTMLDivElement>(null);

  const { files } = useFolderLayout(
    folder,
    (originGridContainerRef.current?.children as unknown as HTMLDivElement[]) ||
      []
  );

  const { mouseDownHandler } = useMouseDown({ bookshelf: folder });
  const { mouseUpHandler } = useMouseUp();
  const { mouseMoveHandler } = useMouseMove(folder);

  return (
    <div
      className="relative grid size-full overflow-y-auto p-gridContainerPadding"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${ITEM_WIDTH}px)`,
        gridAutoRows: `${ITEM_HEIGHT}px`,
      }}
      ref={originGridContainerRef}
      onMouseUp={mouseUpHandler}
      onMouseMove={fileElement ? mouseMoveHandler : undefined}
    >
      {/* @TODO: 2024-10-30 PositionHolder 구현 */}
      {isDragging() && draggingFile && (
        <PositionHolder
          file={draggingFile}
          col={draggingFile.row}
          row={draggingFile.col}
        />
      )}
      {files.map((file) => (
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
      ))}
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
  return <FileView key={file.id} file={{ ...file, row, col }} />;
};

export default Bookshelf;
