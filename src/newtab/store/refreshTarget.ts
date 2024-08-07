import { create } from "zustand";

type State = {
  recentRefreshTimes: Map<string, number>;
};

type Actions = {
  updateRecentRefreshTimes: (ids: string[]) => void;
};

export const refreshTargetStore = create<State & Actions>()((set) => ({
  recentRefreshTimes: new Map(),
  updateRecentRefreshTimes: (ids) =>
    set((state) => {
      const map = new Map([...state.recentRefreshTimes]);

      for (const id of ids) {
        map.set(id, new Date().getTime());
      }

      return { recentRefreshTimes: map };
    }),
}));
