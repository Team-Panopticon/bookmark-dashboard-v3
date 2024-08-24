import type { Config } from "tailwindcss";

import {
  GRID_CONTAINER_PADDING,
  ITEM_HEIGHT,
  ITEM_WIDTH,
} from "./src/newtab/utils/constant";

export default {
  darkMode: "selector",
  content: ["./newtab.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width: {
        item: `${ITEM_WIDTH}px`,
      },
      height: {
        item: `${ITEM_HEIGHT}px`,
      },
      padding: {
        gridContainerPadding: `${GRID_CONTAINER_PADDING}px`,
      },
      gridTemplateColumns: {
        "auto-fill-item": `repeat(auto-fill, ${ITEM_WIDTH})`,
      },
    },
  },
  plugins: [],
} satisfies Config;
