import { create } from "zustand";

export interface State {
  currentZIndex: number;
  folders: Folders;
  currentPosition: Position;
}

export interface Position {
  top: number;
  right: number;
}

export interface Folders {
  [key: string]: { zIndex: number; id: string };
}
interface Actions {
  openFolder: (folderId: string) => void;
  focusFolder: (timestampId: string) => void;
  closeFolder: (timestampId: string) => void;
  closeFolderById: (id: string) => void;
  updateFolderCurrentPosition: (position: Position) => void;
  getFolderCurrentPosition: (
    folderHeight: number,
    folderWidth: number
  ) => Position;
}

const OFFSET = 2;
const POSITION_OFFSET = 50;

export const folderStore = create<State & Actions>((set, get) => ({
  currentZIndex: 1000,
  folders: {},
  currentPosition: { top: 0, right: 0 },

  openFolder: (id) => {
    const timestampId = new Date().toString();
    set((state) => ({
      folders: {
        ...state.folders,
        [timestampId]: {
          id,
          zIndex: state.currentZIndex + OFFSET,
        },
      },
      currentZIndex: state.currentZIndex + OFFSET,
    }));
    console.debug("open folder >> ", timestampId);
  },

  focusFolder: (timestampId) => {
    set((state) => {
      const newFolders = { ...state.folders };
      newFolders[timestampId].zIndex = state.currentZIndex + OFFSET;
      return {
        folders: newFolders,
        currentZIndex: state.currentZIndex + OFFSET,
      };
    });
    console.debug("focus folder >> ", timestampId);
  },

  closeFolder: (timestampId) => {
    set((state) => {
      const newFolders = { ...state.folders };
      delete newFolders[timestampId];
      return { folders: newFolders };
    });
    console.debug("close folder >> ", timestampId);
  },

  /** @TODO 미사용?  */
  closeFolderById: (id) => {
    set((state) => {
      const newFolders = Object.keys(state.folders)
        .filter((timestampId) => state.folders[timestampId].id !== id)
        .reduce((acc, timestampId) => {
          acc[timestampId] = state.folders[timestampId];
          return acc;
        }, {} as Folders);
      return { folders: newFolders };
    });
    console.debug("close folder >> ", id);
  },

  updateFolderCurrentPosition: (position) => {
    const targetPosition = {
      top: position.top + POSITION_OFFSET,
      right: position.right + POSITION_OFFSET,
    };
    set({ currentPosition: targetPosition });
  },

  getFolderCurrentPosition: (folderHeight, folderWidth) => {
    const { top, right } = get().currentPosition;
    const { offsetHeight, offsetWidth } = document.body;

    const targetPosition = {
      top: top + folderHeight >= offsetHeight ? 0 : top,
      right: right + folderWidth >= offsetWidth ? 0 : right,
    };

    /** @TODO: set과 get을 분리 */
    set({
      currentPosition: {
        top: targetPosition.top + POSITION_OFFSET,
        right: targetPosition.right + POSITION_OFFSET,
      },
    });

    return targetPosition;
  },
}));
