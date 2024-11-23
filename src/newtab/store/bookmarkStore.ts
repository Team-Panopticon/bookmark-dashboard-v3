import { create } from "zustand";
import BookmarkApi from "../utils/bookmarkApi";
import { File } from "../../types/store";

type State = {
  bookmark: File | null;
};

type Actions = {
  getBookmark: () => Promise<File>;
  getSubtree: (id: string) => File | null;
};

export const bookmarkStore = create<State & Actions>()((set, get) => ({
  bookmark: null,
  getBookmark: async () => {
    const subTree = await BookmarkApi.getSubTree("1");
    set({ bookmark: subTree });
    return subTree;
  },
  getSubtree: (id: string) => {
    const bookmark = get().bookmark;

    if (!bookmark) return null;

    return findNodeById(id, bookmark);
  },
}));

function findNodeById(id: string, node: File): File | null {
  if (node.id === id) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const result = findNodeById(id, child);
      if (result) {
        return result;
      }
    }
  }

  return null;
}
