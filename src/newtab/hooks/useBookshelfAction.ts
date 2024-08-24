import { Item } from "../../types/store";
import { openContextMenu } from "../utils/contextMenu";
import { tooltipStore } from "../store/tooltip";
import { bookshelfModalStore } from "../store/bookshelfModal";

interface Props {
  folderItem?: Item;
  /** @TODO 리액트 식으로 처리 */
  // context: SetupContext<Record<string, any>>;
}

export const useBookshelfAction = (props: Props) => {
  const { folderItem } = props;

  const { setTooltipPosition, setTooltipShow, setTooltipText } = tooltipStore();

  const { openBookshelfModal } = bookshelfModalStore();

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
    const { id } = item;
    if (isDesktop) {
      openBookshelfModal(id);
    } else {
      /** @TODO 리액트 식으로 처리 */
      // context.emit("routeInFolder", id);
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
