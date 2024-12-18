import { create } from "zustand";

type States = {
  focusedIds: Set<string>; // 현재 focus된 ID들의 배열
};

type Actions = {
  addFocus: (id: string[]) => void; // 새로운 ID 추가
  removeFocus: (id: string[]) => void; // 특정 ID 제거
  clearFocus: () => void; // 모든 focus 초기화
};

const useFocusStore = create<States & Actions>((set) => ({
  focusedIds: new Set(),

  addFocus: (ids: string[]) =>
    set((state) => ({
      focusedIds: new Set([...state.focusedIds, ...ids]), // 기존 ID와 새 ID를 병합 후 중복 제거
    })),

  removeFocus: (ids: string[]) =>
    set((state) => {
      const newFocusedIds = new Set(state.focusedIds);
      ids.forEach((id) => newFocusedIds.delete(id));

      return { focusedIds: newFocusedIds };
    }),

  clearFocus: () => set({ focusedIds: new Set() }),
}));

export default useFocusStore;
