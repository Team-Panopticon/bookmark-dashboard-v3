import { useEffect, useRef, useState } from "react";
import { rootStore } from "../store/rootStore";

import BookmarkApi from "../utils/bookmarkApi";
import { Z_INDEX } from "../utils/constant";
import { layoutDB } from "../utils/layoutDB";

const InfoDialog = () => {
  const { editDialog, setEditDialog, refreshBookmark } = rootStore();
  const { bookmark, isOpen } = editDialog;
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const handleCloseButtonClick = () => {
    setEditDialog({ isOpen: false, bookmark: null });
  };
  const handleSaveButtonClick = async () => {
    if (!bookmark) {
      return;
    }
    await BookmarkApi.update(bookmark.id, title, url);
    handleCloseButtonClick();
    refreshBookmark();
  };
  const handleRemoveButtonClick = async () => {
    if (!bookmark) {
      return;
    }
    await BookmarkApi.recursiveRemove(bookmark.id);
    await layoutDB.deleteItemLayoutById(bookmark.id);
    handleCloseButtonClick();
    refreshBookmark();
  };
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url || "");
    }
  }, [bookmark]);

  useEffect(() => {
    if (!bookmark?.url) {
      return titleRef.current?.focus();
    }
    urlRef.current?.focus();
  }, [bookmark?.url, isOpen]);

  if (!isOpen || !bookmark) {
    return null;
  }

  return (
    <div className="container">
      <div
        className="absolute  left-1/2 top-[10vh] flex w-[330px] min-w-[200px] -translate-x-1/2 flex-col rounded-[10px] bg-white"
        style={{
          zIndex: Z_INDEX.CONTEXT_MENU,
          boxShadow:
            "inset 0 0 3px rgba(0, 0, 0, 0.1) ,  0 0 3px rgba(0, 0, 0, 0.5), 0 8px 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div className="z-10 m-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-1 flex-col">
              <div className="flex flex-1 gap-2">
                <div className="w-11 text-right text-[#00000080]">Title: </div>
                <div className="flex flex-1 items-center">
                  <input
                    type="text"
                    value={title}
                    className="flex-1 rounded px-[7px] py-[3px] focus:outline-[#007BFF80]"
                    style={{
                      boxShadow:
                        " 0px 0.5px 2.5px rgba(0, 0, 0, 0.3), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.05)",
                    }}
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    ref={titleRef}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-1 gap-2">
                <div className="w-11 text-right text-[#00000080]">URL: </div>
                <div className="flex flex-1 items-center">
                  <input
                    ref={urlRef}
                    type="text"
                    disabled={!bookmark?.url}
                    className="flex-1 rounded px-[7px] py-[3px] focus:outline-[#007BFF80]"
                    style={{
                      boxShadow:
                        " 0px 0.5px 2.5px rgba(0, 0, 0, 0.3), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.05)",
                    }}
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <button
                style={{
                  boxShadow:
                    "0px 0px 0px 0.5px rgba(0, 0, 0, 0.05),  0px 0.5px 2.5px 0px rgba(0, 0, 0, 0.3)",
                  background: "white",
                }}
                onClick={handleRemoveButtonClick}
                className="h-[22px] w-14 rounded-md px-[7px] py-[3px] text-[#FF3B30]"
              >
                Delete
              </button>
            </div>
            <div className="flex gap-2">
              <button
                style={{
                  boxShadow:
                    "0px 0px 0px 0.5px rgba(0, 0, 0, 0.05),  0px 0.5px 2.5px 0px rgba(0, 0, 0, 0.3)",
                  background: "white",
                }}
                onClick={handleCloseButtonClick}
                className="h-[22px] w-14 rounded-md px-[7px] py-[3px] text-black"
              >
                Cancel
              </button>
              <button
                style={{
                  boxShadow:
                    "0px 0px 0px 0.5px rgba(0, 122, 255, 0.12),  0px 1px 2.5px 0px rgba(0, 122, 255, 0.24)",
                  background:
                    " linear-gradient(to bottom, rgba(255,255,255,0.17), rgba(255,255,255,0)), #007AFF",
                }}
                onClick={handleSaveButtonClick}
                className="h-[22px] w-11 rounded-md px-[7px] py-[3px] text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;
