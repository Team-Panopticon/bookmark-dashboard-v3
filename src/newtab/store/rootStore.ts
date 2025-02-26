import { create } from "zustand";
import { Bookshelf, Bookmark, BookmarkType, Folders } from "../../types/store";
import BookmarkApi from "../utils/bookmarkApi";
import { layoutDB, LayoutMap } from "../utils/layoutDB";
import { Point } from "../../types/Point";
import { Z_INDEX, POSITION_OFFSET } from "../utils/constant";

type Position = {
  x: number;
  y: number;
};

type State = {
  bookmark: Bookmark;
  contextMenu: {
    isContextMenuVisible: boolean;
    contextMenuPosition: Position;
    timestampId: string | null;
  };
  focus: {
    focusedIds: Set<string>;
  };
  dragAndDrop?: {
    bookmark?: Bookmark;
    fileElement?: HTMLElement;
    mouseDownAt?: number;
    bookshelfAtMouseDown?: Bookshelf;
    startPoint?: Position;
    offsetBetweenStartPointAndFileLeftTop?: Position;
    timestamp?: string;
  };
  folder: {
    currentZIndex: number;
    folders: Folders;
    currentPosition: Position;
  };

  edit: {
    // bookmark?: Bookmark;
    timestampId: string | null;
  };
};

type Action = {
  //edit
  setEdit: (id: string | null) => void;

  // bookmark
  getBookmark: () => Promise<Bookmark>;
  getSubtree: (id: string) => Bookmark | null;
  refreshBookmark: () => Promise<void>;
  updateFilesLayout: (
    files: { id: string; row: number; col: number; parentId: string }[]
  ) => Promise<void>;

  // contextMenu
  setContextMenu: (state: Partial<State["contextMenu"]>) => void;

  // focus
  addFocus: (id: string[]) => Set<string>; // 새로운 ID 추가
  removeFocus: (id: string[]) => void; // 특정 ID 제거
  clearFocus: () => void; // 모든 focus 초기화

  // dragndrop
  isDragging: () => boolean;
  setDragAndDrop: (state: Partial<State["dragAndDrop"]>) => void;
  flush: () => void;

  // folder

  openFolder: (folderId: string) => void;
  focusFolder: (timestamp: string) => void;
  closeFolder: (timestamp: string) => void;
  closeFolderById: (id: string) => void;
  updateFolderCurrentPosition: (position: Position) => void;
  getFolderCurrentPosition: (
    folderHeight: number,
    folderWidth: number
  ) => Position;
};

export const rootStore = create<State & Action>()((set, get) => ({
  // edit
  edit: {
    timestampId: null,
  },
  setEdit: (id) => set({ edit: { timestampId: id } }),

  // bookmark,
  bookmark: {} as Bookmark,
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

  // contextMenu
  contextMenu: {
    isContextMenuVisible: false,
    timestampId: null,
    contextMenuPosition: { x: 0, y: 0 },
  },
  setContextMenu: (nextState) => {
    set({ contextMenu: { ...get().contextMenu, ...nextState } });
  },

  // focus
  focus: {
    focusedIds: new Set(),
  },
  addFocus: (ids: string[]) => {
    const { focusedIds } = get().focus;
    const newSet = new Set([...focusedIds, ...ids]);

    set(() => ({
      focus: {
        focusedIds: newSet, // 기존 ID와 새 ID를 병합 후 중복 제거
      },
    }));

    return newSet;
  },
  removeFocus: (ids: string[]) =>
    set((state) => {
      const newFocusedIds = new Set(state.focus.focusedIds);
      ids.forEach((id) => newFocusedIds.delete(id));

      return { focus: { focusedIds: newFocusedIds } };
    }),
  clearFocus: () => set({ focus: { focusedIds: new Set() } }),

  // dragAndDrop
  isDragging: () => Boolean(get().dragAndDrop?.bookmark),
  setDragAndDrop: (nextState) => {
    set({ dragAndDrop: { ...get().dragAndDrop, ...nextState } });
  },
  flush: () => {
    set({
      dragAndDrop: {
        bookmark: undefined,
        fileElement: undefined,
        mouseDownAt: undefined,
        bookshelfAtMouseDown: undefined,
        startPoint: undefined,
        offsetBetweenStartPointAndFileLeftTop: undefined,
        timestamp: undefined,
      },
    });
  },

  // folder
  folder: {
    currentZIndex: Z_INDEX.FOLDER_BASE,
    folders: {},
    currentPosition: { x: 0, y: 0 },
  },
  openFolder: (id) => {
    const timestamp = `${Date.now()}`;
    set({
      folder: {
        ...get().folder,
        folders: {
          ...get().folder.folders,
          [timestamp]: {
            id,
            zIndex: get().folder.currentZIndex + Z_INDEX.FOLDER_OFFSET,
          },
        },
        currentZIndex: get().folder.currentZIndex + Z_INDEX.FOLDER_OFFSET,
      },
    });
    console.debug("open folder >> ", timestamp);
  },

  focusFolder: (timestamp) => {
    const newFolders = { ...get().folder.folders };
    newFolders[timestamp].zIndex =
      get().folder.currentZIndex + Z_INDEX.FOLDER_OFFSET;

    set({
      folder: {
        ...get().folder,
        folders: newFolders,
        currentZIndex: get().folder.currentZIndex + Z_INDEX.FOLDER_OFFSET,
      },
    });

    console.debug("focus folder >> ", timestamp);
  },

  closeFolder: (timestamp) => {
    const newFolders = { ...get().folder.folders };
    delete newFolders[timestamp];
    set({
      folder: {
        ...get().folder,
        folders: newFolders,
      },
    });
    console.debug("close folder >> ", timestamp);
  },

  /** @TODO 미사용?  */
  closeFolderById: (id) => {
    const newFolders = Object.keys(get().folder.folders)
      .filter((timestamp) => get().folder.folders[timestamp].id !== id)
      .reduce((acc, timestamp) => {
        acc[timestamp] = get().folder.folders[timestamp];
        return acc;
      }, {} as Folders);
    set({ folder: { ...get().folder, folders: newFolders } });
    console.debug("close folder >> ", id);
  },

  updateFolderCurrentPosition: (position) => {
    const targetPosition = {
      x: position.y + POSITION_OFFSET,
      y: position.x + POSITION_OFFSET,
    };
    set({ folder: { ...get().folder, currentPosition: targetPosition } });
  },

  getFolderCurrentPosition: (folderHeight, folderWidth) => {
    const { x, y } = get().folder.currentPosition;
    const { offsetHeight, offsetWidth } = document.body;

    const targetPosition: Position = {
      y: y + folderHeight >= offsetHeight ? 0 : y,
      x: x + folderWidth >= offsetWidth ? 0 : x,
    };

    /** @TODO: set과 get을 분리 */
    set({
      folder: {
        ...get().folder,
        currentPosition: {
          y: targetPosition.y + POSITION_OFFSET,
          x: targetPosition.x + POSITION_OFFSET,
        },
      },
    });

    return targetPosition;
  },
}));

export function getOffsetBetweenPoints(p1: Point, p2: Point) {
  return {
    x: Math.abs(p1.x - p2.x),
    y: Math.abs(p1.y - p2.y),
  };
}

export const MOUSE_CLICK = {
  LEFT: 0,
  RIGHT: 2,
} as const;

function findNodeById(id: string, node: Bookmark): Bookmark | null {
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

function addRowColToTree(bookmark: Bookmark, layoutMap: LayoutMap): Bookmark {
  if (layoutMap[bookmark.id]) {
    bookmark.row = layoutMap[bookmark.id].row;
    bookmark.col = layoutMap[bookmark.id].col;
    bookmark.type = bookmark.children ? BookmarkType.FOLDER : BookmarkType.PAGE;
  }

  if (bookmark.children) {
    bookmark.children?.forEach((child) => addRowColToTree(child, layoutMap));
  }
  return bookmark;
}
