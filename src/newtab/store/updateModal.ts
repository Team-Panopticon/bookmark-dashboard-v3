import { create } from "zustand";

export interface UpdateModalInfo {
  id: string;
  url?: string | undefined;
  title: string;
  parentId?: string;
  isFolder: boolean;
}
export interface State {
  updateModalInfo: UpdateModalInfo;
  updateModalShow: boolean;
}

interface Actions {
  /** @TODO 미사용 시 제거 */
  // setUpdateModalInfo: (info: State["updateModalInfo"]) => void;
  // setUpdateModalShow: (show: boolean) => void;
  openBookmarkUpdate: (info: State["updateModalInfo"]) => void;
  closeBookmarkUpdate: () => void;
}

export const updateModalStore = create<State & Actions>((set) => ({
  updateModalInfo: {
    id: "",
    url: undefined,
    title: "",
    parentId: "",
    isFolder: false,
  },
  updateModalShow: false,

  /** @TODO 미사용 시 제거 */
  // setUpdateModalInfo: (info) => set({ updateModalInfo: { ...info } }),
  // setUpdateModalShow: (show) => set({ updateModalShow: show }),

  openBookmarkUpdate: (info) => {
    set({ updateModalInfo: { ...info }, updateModalShow: true });
  },
  closeBookmarkUpdate: () => set({ updateModalShow: false }),
}));
