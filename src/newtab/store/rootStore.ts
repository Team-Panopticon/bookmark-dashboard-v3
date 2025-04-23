import { create } from "zustand";
import { Bookshelf, Bookmark, BookmarkType, Folders } from "../../types/store";
import BookmarkApi from "../utils/bookmarkApi";
import { ItemLayout, layoutDB, LayoutMap } from "../utils/layoutDB";
import { Point } from "../../types/Point";
import { Z_INDEX, POSITION_OFFSET } from "../utils/constant";

type Position = {
  x: number;
  y: number;
};

type State = {
  bookmark: Bookmark;
  contextMenu: {
    context: Bookmark;
    isContextMenuVisible: boolean;
    contextMenuPosition: Position;
    timestampId: string | null;
  };
  focus: {
    focusedIds: Set<string>;
    focusCursor?: { target?: ItemLayout; currentBookshelf: string };
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
  layoutMap: LayoutMap;
};

type Action = {
  //edit
  setEdit: (id: string | null) => void;

  // bookmark
  getSubtree: (id: string) => Bookmark | null;
  refreshBookmark: () => Promise<void>;
  updateFilesLayout: (
    files: { id: string; row: number; col: number; parentId: string }[]
  ) => Promise<void>;

  // contextMenu
  setContextMenu: (state: Partial<State["contextMenu"]>) => void;

  // focus
  addFocus: (timestampIds: string[], bookshelfTimestamp: string) => Set<string>; // 새로운 ID 추가
  removeFocus: (id: string[]) => void; // 특정 ID 제거
  clearFocus: () => void; // 모든 focus 초기화
  moveFocus: (direction: string) => Promise<void>; // 키보드로 포커스 이동

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
  refreshBookmark: async () => {
    const subTree = await BookmarkApi.getSubTree("1");
    const layout = await layoutDB.getAllLayout();
    const bookmark = addRowColToTree(subTree, layout);

    set({ bookmark, layoutMap: layout });
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
    context: {} as Bookmark,
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
  addFocus: (timestampIds: string[], bookshelfTimestamp: string) => {
    const { focusedIds } = get().focus;
    const newSet = new Set([...focusedIds, ...timestampIds]);

    const timestampId = timestampIds[0] || "";
    const [, id] = timestampId.split("_");

    set(() => ({
      focus: {
        focusedIds: newSet,
        focusCursor: {
          target: get().layoutMap[id],
          currentBookshelf: bookshelfTimestamp,
        },
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
  moveFocus: async (direction: string) => {
    const { focusCursor } = get().focus;
    if (!focusCursor) return;

    const { target, currentBookshelf } = focusCursor;
    if (!target || !currentBookshelf) return;

    const { parentId, row, col } = target;

    const getNextPosition = () => {
      switch (direction) {
        case "ArrowUp":
          return { row: row - 1, col };
        case "ArrowDown":
          return { row: row + 1, col };
        case "ArrowLeft":
          return { row, col: col - 1 };
        case "ArrowRight":
          return { row, col: col + 1 };
        default:
          return null;
      }
    };

    const nextPosition = getNextPosition();
    if (!nextPosition) return;

    const next = await layoutDB.getItemByRowCol({
      parentId,
      ...nextPosition,
    });

    if (next) {
      const { id } = next;
      const timestampId = `${currentBookshelf}_${id}`;
      set(() => ({
        focus: {
          focusedIds: new Set([timestampId]),
          focusCursor: {
            target: get().layoutMap[id],
            currentBookshelf,
          },
        },
      }));
    }
  },

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
  layoutMap: {},
  setLayoutMap: (layoutMap: LayoutMap) => {
    set({ layoutMap });
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
  bookmark.type = bookmark.children ? BookmarkType.FOLDER : BookmarkType.PAGE;
  if (layoutMap[bookmark.id]) {
    bookmark.row = layoutMap[bookmark.id].row;
    bookmark.col = layoutMap[bookmark.id].col;
  }

  if (bookmark.children) {
    bookmark.children?.forEach((child) => addRowColToTree(child, layoutMap));
  }
  return bookmark;
}
