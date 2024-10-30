import type { FC } from "react";
import { useRef } from "react";
import { type File } from "../../types/store";
import { useFolderLayout } from "../hooks/useBookshelfLayout";
import { ITEM_HEIGHT, ITEM_WIDTH } from "../utils/constant";
import { useMouseDown } from "../hooks/useMouseDown";
import { useMouseUp } from "../hooks/useMouseUp";

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

  const originGridContainerRef = useRef<HTMLDivElement>(null);

  const { files } = useFolderLayout(
    folder,
    (originGridContainerRef.current?.children as unknown as HTMLDivElement[]) ||
      []
  );

  const { mouseDownHandler } = useMouseDown({ bookshelf: folder });
  const { mouseUpHandler } = useMouseUp();

  return (
    <div
      className="relative grid size-full overflow-y-auto p-gridContainerPadding"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${ITEM_WIDTH}px)`,
        gridAutoRows: `${ITEM_HEIGHT}px`,
      }}
      ref={originGridContainerRef}
      onMouseUp={mouseUpHandler}
    >
      {files.map((file) => (
        <div
          onMouseDown={(e) => {
            mouseDownHandler({
              currentTarget: e.currentTarget,
              file,
              point: { x: e.pageX, y: e.pageY },
            });
          }}
        >
          {file.type === "FOLDER" ? (
            <div
              className="flex justify-center bg-none"
              style={{
                gridRow: file.row || "auto",
                gridColumn: file.col || "auto",
              }}
            >
              <div className="flex h-full  flex-col items-center gap-2">
                <button
                  className="h-item w-item"
                  style={{
                    padding: "8px",
                    border: "1px solid transparent",
                    width: "70px",
                    height: "90px",
                  }}
                >
                  <div className="text-[48px] text-yellow-500">
                    {file.title.charAt(0)}
                  </div>
                  <p className="line-clamp-2 transform-none overflow-hidden text-ellipsis break-words text-xs leading-5 tracking-[.2px]">
                    {file.title}
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex justify-center bg-none"
              style={{
                gridRow: file.row || "auto",
                gridColumn: file.col || "auto",
              }}
            >
              <div className="flex h-full flex-col items-center gap-2">
                <button
                  className="h-item w-item"
                  style={{
                    padding: "8px",
                    border: "1px solid transparent",
                    width: "70px",
                    height: "90px",
                  }}
                >
                  <div className="text-[48px] text-yellow-500">
                    {file.title.charAt(0)}
                  </div>
                  <p className="line-clamp-2 transform-none overflow-hidden text-ellipsis break-words text-xs leading-5 tracking-[.2px]">
                    {file.title}
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Bookshelf;
