import { create } from "zustand";
import BookmarkApi from "../utils/bookmarkApi";
import { File, FileType } from "../../types/store";
import { layoutDB, LayoutMap } from "../utils/layoutDB";

type State = {
  bookmark: File;
};

type Actions = {
  getBookmark: () => Promise<File>;
  getSubtree: (id: string) => File | null;
  refreshBookmark: () => Promise<void>;
  updateFilesLayout: (
    files: { id: string; row: number; col: number; parentId: string }[]
  ) => Promise<void>;
};

/**
 * bookmark, layoutDB도 조회하자.
 * bookmark나 layoutDB를 변경하면 -> 다 리프레시 할 수 있도록
 */
export const bookmarkStore = create<State & Actions>()((set, get) => ({
  bookmark: {} as File,
  getBookmark: async () => {
    await get().refreshBookmark();
    return get().bookmark;
  },
  refreshBookmark: async () => {
    const subTree = await BookmarkApi.getSubTree("1");
    const layout = await layoutDB.getAllLayout();
    const bookmark = addRowColToTree(subTree, layout);

    set({ bookmark });
  },
  getSubtree: (id) => {
    const bookmark = get().bookmark;

    if (!bookmark) return null;

    return findNodeById(id, bookmark);
  },

  updateFilesLayout: async (files) => {
    for await (const file of files) {
      await layoutDB.setItemLayoutById(file);
    }

    get().refreshBookmark();
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

function addRowColToTree(bookmark: File, layoutMap: LayoutMap): File {
  if (layoutMap[bookmark.id]) {
    bookmark.row = layoutMap[bookmark.id].row;
    bookmark.col = layoutMap[bookmark.id].col;
    bookmark.type = bookmark.children ? FileType.FOLDER : FileType.BOOKMARK;
  }

  if (bookmark.children) {
    bookmark.children?.forEach((child) => addRowColToTree(child, layoutMap));
  }
  return bookmark;
}
