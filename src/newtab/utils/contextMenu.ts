import { ContextMenuTarget, contextMenuStore } from "../store/contextMenu";

export const openContextMenu = (
  event: PointerEvent,
  target: ContextMenuTarget
): void => {
  const { setTarget, setPosition, setShow } = contextMenuStore();

  setTarget(target);
  setPosition({ x: event.clientX, y: event.clientY });
  setShow(true);
};
