import { File } from "../../types/store";
import { openContextMenu } from "../utils/contextMenu";
import { tooltipStore } from "../store/tooltip";
import { folderStore } from "../store/folder";

interface Props {
  folder?: File;
  routeInFolder?: (file: File) => void;
  /** @TODO 리액트 식으로 처리 */
  // context: SetupContext<Record<string, any>>;
}

export const useBookshelfAction = (props: Props) => {
  const { folder, routeInFolder } = props;

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

  const onClickFolder = (file: File): void => {
    const isDesktop = folder?.parentId === "0";
    const { id } = file;
    if (isDesktop) {
      openFolder(id);
    } else {
      routeInFolder?.(file);
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
