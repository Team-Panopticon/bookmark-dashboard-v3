import { create } from "zustand";
import { Item } from "../../types/store";

export type Position = {
  x: number;
  y: number;
};

export type ContextMenuTarget = {
  item: Item;
  type: "FILE" | "FOLDER" | "BACKGROUND";
};

export type State = {
  isShow: boolean;
  position: Position;
  target?: ContextMenuTarget;
};

interface Actions {
  setShow: (show: boolean) => void;
  setPosition: (position: Position) => void;
  setTarget: (target: ContextMenuTarget) => void;
  getCssVars: () => { "--top": string; "--left": string };
  getShow: () => boolean;
  getTarget: () => ContextMenuTarget | undefined;
}

export const contextMenuStore = create<State & Actions>((set, get) => ({
  isShow: false,
  position: { x: 0, y: 0 },
  target: undefined,

  setShow: (show) => set({ isShow: show }),
  setPosition: (position) => set({ position }),
  setTarget: (target) => set({ target }),

  getCssVars: () => {
    const { position } = get();
    return {
      "--top": `${position.y}px`,
      "--left": `${position.x}px`,
    };
  },
  getShow: () => get().isShow,
  getTarget: () => get().target,
}));
