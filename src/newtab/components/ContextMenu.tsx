import { useEffect, useMemo } from "react";

import { rootStore } from "../store/rootStore";
import BookmarkApi from "../utils/bookmarkApi";
import { Z_INDEX } from "../utils/constant";

interface ContextMenu {
  title: string;
  onClick: (e: React.MouseEvent) => void;
}

const ContextMenu = () => {
  const {
    focus: { focusedIds },
    setEdit,
    contextMenu: {
      contextMenuPosition,
      isContextMenuVisible,
      timestampId,
      context,
    },
    setContextMenu,
    setEditDialog,
  } = rootStore();

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", onContextMenu);
  }, []);

  const menuList: ContextMenu[] = useMemo(() => {
    const URL수정 = {
      title: "URL수정",
      onClick: async (e: React.MouseEvent) => {
        if (!timestampId) return;
        e.stopPropagation();
        const target = await BookmarkApi.get([timestampId.split("_")[1]]);
        setEditDialog({
          isOpen: true,
          bookmark: target[0],
        });
        setContextMenu({isContextMenuVisible: false});
      },
    };
    const 이름변경 = {
      title: "이름 변경",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setEdit(timestampId);
        setContextMenu({ isContextMenuVisible: false });
      },
    };

    const 삭제 = {
      title: "삭제",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        focusedIds.forEach((timestampId) => {
          /** 다 삭제 */
          const bookmarkId = timestampId.split("_")[1];
          bookmarkId && BookmarkApi.recursiveRemove(bookmarkId);
        });
        setContextMenu({ isContextMenuVisible: false });
      },
    };
    const 폴더생성 = {
      title: "폴더생성",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        BookmarkApi.create(context.id, "무제 폴더");
        setContextMenu({ isContextMenuVisible: false });
      },
    };

    // 파일 및 폴더 일때
    if (focusedIds.size === 0) {
      // File.contxetmenu()

      // 빈공간 일때
      // 폴더 추가
      // 파일 추가
      return [폴더생성];
    } else if (focusedIds.size === 1) {
      // 포커스가 1개일 때 -> 수정 / 삭제

      return [이름변경, URL수정, 삭제];
    } else {
      // 포커스가 여러개일 때 -> 삭제
      return [삭제];
    }
  }, [
    context,
    focusedIds,
    setContextMenu,
    setEdit,
    setEditDialog,
    timestampId,
  ]);

  if (!isContextMenuVisible) return null;
  return (
    <div
      className="flex w-[150px] flex-col rounded-md border-[0.5px] border-solid border-[#b8b8b8] bg-[#eaeaeac9] p-1 text-xs shadow-md backdrop-blur-md"
      style={{
        position: "absolute",
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
        zIndex: Z_INDEX.CONTEXT_MENU,
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 6px 24px;",
      }}
    >
      {menuList.map((menu) => {
        return (
          <button
            className="flex h-6 cursor-default items-center justify-start rounded-md px-2.5 py-1 hover:bg-[#4898ff] hover:text-white"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => menu.onClick(e)}
          >
            {menu.title}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;
