import {useEffect, useState} from "react";
import {version} from "../../package.json";

const PopUp = () => {
  const [theme, setTheme] = useState<"wallpaper" | "none">("wallpaper");
  useEffect(() => {
    chrome.storage?.local.get("theme", (result) => {
      if (result.theme) {
        setTheme(result.theme);
      } else {
        setTheme("wallpaper");
      }
    });
  }, []);
  return (
    <div className="flex w-[260px] flex-col bg-white p-3 text-xs shadow-md backdrop-blur-md">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col items-center justify-center gap-[10px]">
          <div className="text-[13px] font-semibold">
            Bookmark Dashboard <span className="text-[9px]">v{version}</span>
          </div>
          <div className="text-[11px]">
            Manage your bookmarks in a simple dashboard
          </div>
        </div>
        <div className="flex justify-center gap-1">
          <a
            href="https://github.com/Team-Panopticon/bookmark-dashboard-v3"
            target="_blank"
            className="text-[12px] hover:text-sky-700"
          >
            Github
          </a>
          <span>&nbsp;|&nbsp;</span>
          <a
            href="https://github.com/Team-Panopticon/bookmark-dashboard-v3/issues"
            target="_blank"
            className="text-[12px] hover:text-sky-700"
          >
            Suggestions
          </a>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[12px]">
          <input
            type="checkbox"
            checked={theme === "wallpaper"}
            onChange={(e) => {
              const newTheme = e.target.checked ? "wallpaper" : "none";
              setTheme(newTheme);

              chrome.runtime.sendMessage({
                theme: newTheme,
                type: "updateConfig",
              });
            }}
          />
          wallpaper
        </div>
      </div>
    </div>
  );
};

export default PopUp;
