import { create } from "zustand";

type State = {
  tooltipPosition: {
    x: number;
    y: number;
  };
  tooltipText: string;
  tooltipShow: boolean;
  tooltipOn: boolean;
};

type Actions = {
  setTooltipPosition: (position: State["tooltipPosition"]) => void;
  setTooltipText: (text: string) => void;
  setTooltipShow: (isShow: boolean) => void;
  /** hover로 변경 고민 */
  setTooltipOn: (on: boolean) => void;
};

export const useModalStore = create<State & Actions>()((set) => ({
  tooltipPosition: { x: 0, y: 0 },
  tooltipText: "",
  tooltipShow: false,
  tooltipOn: true,
  setTooltipPosition: (position) => set({ tooltipPosition: { ...position } }),
  setTooltipText: (text) => set({ tooltipText: text }),
  setTooltipShow: (show) => set({ tooltipShow: show }),
  setTooltipOn: (on) => set({ tooltipOn: on }),
}));
