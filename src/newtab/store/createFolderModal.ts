import { create } from "zustand";

interface State {
  createModalInfo: {
    parentId: string;
  };
  createModalShow: boolean;
}

interface Actions {
  setBookmarkCreateInfo: (modalInfo: State["createModalInfo"]) => void;
  resetBookmarkCreateInfo: () => void;
  setBookmarkCreateShow: (createModalShow: State["createModalShow"]) => void;
}

export const createModalStore = create<State & Actions>()((set) => ({
  createModalInfo: { parentId: "" },
  createModalShow: false,
  setBookmarkCreateInfo: (createModalInfo) => set(() => ({ createModalInfo })),
  setBookmarkCreateShow: (createModalShow) => set(() => ({ createModalShow })),
  resetBookmarkCreateInfo: () =>
    set(() => ({ createModalInfo: { parentId: "" } })),
}));
