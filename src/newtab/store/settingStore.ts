import {create} from "zustand";
import {persist, PersistStorage} from "zustand/middleware";

type State = {
  theme: "wallpaper" | "none";
};
type Action = {
  setTheme: (theme: "wallpaper" | "none") => void;
};

const chromeStorage: PersistStorage<State & Action> = {
  getItem: async (name) => {
    return new Promise(() => {
      chrome.storage?.local.get([name]);
    });
  },
  setItem: async (name, value) => {
    return new Promise<void>(() => {
      chrome.storage?.local.set({[name]: value});
    });
  },
  removeItem: async (name) => {
    return new Promise<void>((resolve) => {
      chrome.storage?.local.remove(name, () => {
        resolve();
      });
    });
  },
};

export const settingStore = create<State & Action>()(
  persist(
    (set) => ({
      theme: "wallpaper",
      setTheme: (theme) => set({theme}),
    }),
    {
      name: "setting-storage",
      storage: chromeStorage,
    }
  )
);
