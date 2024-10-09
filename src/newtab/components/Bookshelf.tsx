import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { FileType, type File } from "../../types/store";
import { useBookshelfAction } from "../hooks/useBookshelfAction";
import { useFolderLayout } from "../hooks/useBookshelfLayout";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { ITEM_HEIGHT, ITEM_WIDTH } from "../utils/constant";
import { layoutDB, LayoutMap } from "../utils/layoutDB";

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

/** @TODO: 폴더로 넣는 경우 두개씩 사라지는 현상 발생. */

const Bookshelf: FC<Props> = (props) => {
  const { id, routeInFolder, folder } = props;
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const originGridContainerRef = useRef<HTMLDivElement>(null);

  const { files } = useFolderLayout(
    folder,
    (originGridContainerRef.current?.children as unknown as HTMLDivElement[]) ||
      []
  );

  const { openTooltip, closeTooltip, openUrl, openContextMenu, onClickFolder } =
    useBookshelfAction({ folder, routeInFolder });

  const { mousedownHandler } = useDragAndDrop({
    openUrl,
    onClickFolder,
    originGridContainer: originGridContainerRef.current,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onReceiveChromeMessage = (request: unknown, sender: any) => {
    if (sender.id !== chrome.runtime.id) {
      return;
    }

    if (isDarkModeEvent(request)) {
      setDarkMode(request.darkMode as boolean);
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onReceiveChromeMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(onReceiveChromeMessage);
    };
  }, []);

  return (
    <div
      className="grid-container relative grid size-full overflow-y-auto p-gridContainerPadding"
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${ITEM_WIDTH}px)`,
        gridAutoRows: `${ITEM_HEIGHT}px`,
      }}
      ref={originGridContainerRef}
      data-parent-id={id}
      data-timestamp={Date.now()}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
        openContextMenu(event, { item: folder, type: "BACKGROUND" });
      }}
    >
      {files.map((item) => (
        <>
          {item.children ? (
            <div
              className="btn-wrapper flex justify-center bg-none"
              data-parent-id={id}
              style={{
                gridRow: item.row || "auto",
                gridColumn: item.col || "auto",
              }}
              data-id={item.id}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data-type={item?.type}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data-row={item?.row}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data-col={item?.col}
              onMouseDown={(e) => {
                //left
                e.button === 0 && mousedownHandler(item, e);
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
                    {item.title.charAt(0)}
                  </div>
                  <p className="line-clamp-2 transform-none overflow-hidden text-ellipsis break-words text-xs leading-5 tracking-[.2px]">
                    {item.title}
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div
              className="btn-wrapper flex justify-center bg-none"
              style={{
                gridRow: item.row || "auto",
                gridColumn: item.col || "auto",
              }}
              data-parent-id={id}
              data-id={item.id}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data-type={item?.type}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data-row={item?.row}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              data-col={item?.col}
              onMouseDown={(e) => mousedownHandler(item, e)}
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
                    {item.title.charAt(0)}
                  </div>
                  <p className="line-clamp-2 transform-none overflow-hidden text-ellipsis break-words text-xs leading-5 tracking-[.2px]">
                    {item.title}
                  </p>
                </button>
              </div>
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default Bookshelf;
