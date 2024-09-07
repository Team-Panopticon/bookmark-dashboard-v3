import { create } from "zustand";

export interface State {
  currentZIndex: number;
  bookshelfModals: BookshelfModals;
  currentPosition: Position;
}

export interface Position {
  top: number;
  right: number;
}

export interface BookshelfModals {
  [key: string]: { zIndex: number; id: string };
}
interface Actions {
  openBookshelfModal: (modalId: string) => void;
  focusBookshelfModal: (timestampId: string) => void;
  closeBookshelfModal: (timestampId: string) => void;
  closeBookshelfModalById: (id: string) => void;
  updateBookshelfModalCurrentPosition: (position: Position) => void;
  getBookshelfModalCurrentPosition: (
    modalHeight: number,
    modalWidth: number
  ) => Position;
}

const OFFSET = 2;
const POSITION_OFFSET = 50;

export const bookshelfModalStore = create<State & Actions>((set, get) => ({
  currentZIndex: 1000,
  bookshelfModals: {},
  currentPosition: { top: 0, right: 0 },

  openBookshelfModal: (id) => {
    const timestampId = new Date().toString();
    set((state) => ({
      bookshelfModals: {
        ...state.bookshelfModals,
        [timestampId]: {
          id,
          zIndex: state.currentZIndex + OFFSET,
        },
      },
      currentZIndex: state.currentZIndex + OFFSET,
    }));
    console.debug("open bookshelfModal >> ", timestampId);
  },

  focusBookshelfModal: (timestampId) => {
    set((state) => {
      const newBookshelfModals = { ...state.bookshelfModals };
      newBookshelfModals[timestampId].zIndex = state.currentZIndex + OFFSET;
      return {
        bookshelfModals: newBookshelfModals,
        currentZIndex: state.currentZIndex + OFFSET,
      };
    });
    console.debug("focus bookshelfModal >> ", timestampId);
  },

  closeBookshelfModal: (timestampId) => {
    set((state) => {
      const newBookshelfModals = { ...state.bookshelfModals };
      delete newBookshelfModals[timestampId];
      return { bookshelfModals: newBookshelfModals };
    });
    console.debug("close bookshelfModal >> ", timestampId);
  },

  /** @TODO 미사용?  */
  closeBookshelfModalById: (id) => {
    set((state) => {
      const newBookshelfModals = Object.keys(state.bookshelfModals)
        .filter((timestampId) => state.bookshelfModals[timestampId].id !== id)
        .reduce((acc, timestampId) => {
          acc[timestampId] = state.bookshelfModals[timestampId];
          return acc;
        }, {} as BookshelfModals);
      return { bookshelfModals: newBookshelfModals };
    });
    console.debug("close bookshelfModal >> ", id);
  },

  updateBookshelfModalCurrentPosition: (position) => {
    const targetPosition = {
      top: position.top + POSITION_OFFSET,
      right: position.right + POSITION_OFFSET,
    };
    set({ currentPosition: targetPosition });
  },

  getBookshelfModalCurrentPosition: (modalHeight, modalWidth) => {
    const { top, right } = get().currentPosition;
    const { offsetHeight, offsetWidth } = document.body;

    const targetPosition = {
      top: top + modalHeight >= offsetHeight ? 0 : top,
      right: right + modalWidth >= offsetWidth ? 0 : right,
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
