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
    contextMenu: { contextMenuPosition, isContextMenuVisible, timestampId },
    setContextMenu,
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
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        /** 팝업 */
      },
    };
    const 이름변경 = {
      title: "이름 변경",
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(e);
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
      [...focusedIds][0];
      const target = [...focusedIds][0];
      target;
      return [이름변경, URL수정, 삭제];
    } else {
      // 포커스가 여러개일 때 -> 삭제
      return [삭제];
    }
  }, [focusedIds]);

  console.log("isContextMenuVisible", isContextMenuVisible);
  if (!isContextMenuVisible) return null;
  return (
    <div
      className="flex w-[150px] flex-col rounded border-[0.5px] bg-slate-50 p-2 text-xs"
      style={{
        position: "absolute",
        left: contextMenuPosition.x,
        top: contextMenuPosition.y,
        zIndex: Z_INDEX.CONTEXT_MENU,
      }}
    >
      {menuList.map((menu) => {
        return (
          <div
            className="flex h-6"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => menu.onClick(e)}
          >
            {menu.title}
          </div>
        );
      })}
    </div>
  );
};

export default ContextMenu;
