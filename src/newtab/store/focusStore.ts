import { create } from "zustand";

type States = {
  focusedIds: Set<string>; // 현재 focus된 ID들의 배열
};

type Actions = {
  addFocus: (id: string[]) => Set<string>; // 새로운 ID 추가
  removeFocus: (id: string[]) => void; // 특정 ID 제거
  clearFocus: () => void; // 모든 focus 초기화
};

const useFocusStore = create<States & Actions>((set, get) => ({
  focusedIds: new Set(),

  addFocus: (ids: string[]) => {
    const { focusedIds } = get();
    const newSet = new Set([...focusedIds, ...ids]);

    set(() => ({
      focusedIds: newSet, // 기존 ID와 새 ID를 병합 후 중복 제거
    }));

    return newSet;
  },

  removeFocus: (ids: string[]) =>
    set((state) => {
      const newFocusedIds = new Set(state.focusedIds);
      ids.forEach((id) => newFocusedIds.delete(id));

      return { focusedIds: newFocusedIds };
    }),

  clearFocus: () => set({ focusedIds: new Set() }),
}));

export default useFocusStore;
