import { dragAndDropStore } from "../store/dragAndDrop";
import { folderStore } from "../store/folder";

export const useMouseUp = () => {
  const { mouseDownAt, startPoint, file } = dragAndDropStore();
  const { openFolder } = folderStore();

  const mouseUpHandler = (e: React.MouseEvent) => {
    if (!mouseDownAt || !startPoint || !file) {
      return;
    }

    const moveX = Math.abs(startPoint.x - e.pageX);
    const moveY = Math.abs(startPoint.y - e.pageY);

    const isClick =
      new Date().getTime() - mouseDownAt < 150 && moveX + moveY < 20;

    if (isClick) {
      /** @TODO 클릭 시 툴팁 처리? */
      file.type === "FOLDER"
        ? openFolder(file.id)
        : window.open(file.url, "_blank")?.focus();
      return;
    }
  };

  return { mouseUpHandler };
};
