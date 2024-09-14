import { Item } from "../../types/store";
import { openContextMenu } from "../utils/contextMenu";
import { tooltipStore } from "../store/tooltip";
import { folderStore } from "../store/folder";

interface Props {
  folderItem?: Item;
  routeInFolder?: (id: string, title: string) => void;
  /** @TODO 리액트 식으로 처리 */
  // context: SetupContext<Record<string, any>>;
}

export const useBookshelfAction = (props: Props) => {
  const { folderItem, routeInFolder } = props;

  const { setTooltipPosition, setTooltipShow, setTooltipText } = tooltipStore();

  const { openFolder } = folderStore();

  const openTooltip = (title: string, event: MouseEvent) => {
    const targetElement = event.target as HTMLElement;
    const buttonElement = targetElement.closest("button");
    if (!buttonElement) return;

    const boundingRect = buttonElement.getBoundingClientRect();
    const position = {
      x: boundingRect.x,
      y: boundingRect.y + boundingRect.height,
    };

    setTooltipPosition(position);
    setTooltipText(title);
    setTooltipShow(true);
  };

  const closeTooltip = () => {
    setTooltipShow(false);
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank")?.focus();
    setTooltipShow(false);
  };

  const onClickFolder = (item: Item): void => {
    const isDesktop = folderItem?.parentId === "0";
    const { id, title } = item;
    if (isDesktop) {
      openFolder(id);
    } else {
      routeInFolder?.(id, title);
    }
    setTooltipShow(false);
  };

  return {
    openTooltip,
    closeTooltip,
    openUrl,
    openContextMenu,
    onClickFolder,
  };
};
