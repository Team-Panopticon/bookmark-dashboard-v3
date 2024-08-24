import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import type { FolderItem, Item } from "../../types/store";
import { useBookshelfAction } from "../hooks/useBookshelfAction";
import { useBookshelfLayout } from "../hooks/useBookshelfLayout";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

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
  folderItems?: FolderItem[];
};

const Bookshelf: FC<Props> = (props) => {
  const { id } = props;
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const originGridContainerRef = useRef<HTMLDivElement>(null);

  const { folderItem, setFolderItem } = useBookshelfLayout({
    id,
    itemRefs:
      (originGridContainerRef.current
        ?.children as unknown as HTMLDivElement[]) || [],
  });

  const { openTooltip, closeTooltip, openUrl, openContextMenu, onClickFolder } =
    useBookshelfAction({ folderItem });

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

  /**
   * @TODO
   *
   * tailwindcss를 이용한 스타일링
   * - CSS, DOM구조 맞추기
   */

  return (
    <div
      // eslint-disable-next-line tailwindcss/no-custom-classname
      className="grid-container relative grid size-full overflow-y-auto"
      ref={originGridContainerRef}
      data-parent-id={id}
      data-timestamp={Date.now()}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
        openContextMenu(event, { item: folderItem, type: "BACKGROUND" });
      }}
    >
      {folderItem?.children?.map((item) => (
        <>
          {item.children ? (
            <div
              className="btn-wrapper"
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
              onClick={(e) => mousedownHandler(item, e)}
            >
              폴더 : {item.title}
            </div>
          ) : (
            <div
              className="btn-wrapper"
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
              파일 : {item.title}
            </div>
          )}
        </>
      ))}
    </div>
  );
};

export default Bookshelf;
