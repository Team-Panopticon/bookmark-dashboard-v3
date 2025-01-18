import { create } from "zustand";

type ContextMenuState = {
  isVisible: boolean; // 컨텍스트 메뉴의 표시 여부
  position: { x: number; y: number }; // 컨텍스트 메뉴의 화면 좌표
  openMenu: (x: number, y: number) => void; // 메뉴 열기
  closeMenu: () => void; // 메뉴 닫기
};

const contextMenuStore = create<ContextMenuState>((set) => ({
  isVisible: false, // 초기 상태: 메뉴 숨김
  position: { x: 0, y: 0 }, // 초기 좌표

  // 메뉴 열기
  openMenu: (x, y) =>
    set({
      isVisible: true,
      position: { x, y },
    }),

  // 메뉴 닫기
  closeMenu: () =>
    set({
      isVisible: false,
      position: { x: 0, y: 0 },
    }),
}));

export default contextMenuStore;
