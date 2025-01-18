import { useEffect, useMemo } from "react";
import contextMenuStore from "../store/contextMenuStore";
import focusStore from "../store/focusStore";

interface ContextMenu {
  title: string;
  onClick: VoidFunction;
}

const ContextMenu = () => {
  const { position, isVisible } = contextMenuStore();
  const { focusedIds } = focusStore();
  useEffect(() => {
    window.oncontextmenu = (e) => {
      e.preventDefault();
    };
  }, []);
  const menuList: ContextMenu[] = useMemo(() => {
    const 수정 = {
      title: "수정",
      onClick: () => {
        /** 팝업 */
      },
    };
    const 이름변경 = {
      title: "이름 변경",
      onClick: () => {
        /** @TODO: 파일의 인풋태그로 바뀌는 것 */
      },
    };

    const 삭제 = {
      title: "삭제",
      onClick: () => {
        focusedIds.forEach((focusedId) => {
          /** 다 삭제 */
        });
      },
    };
    const 생성 = { title: "생성", onClick: () => {} };

    const menu: ContextMenu[] = [];
    //   const currentFocusedIds = addFocus([file.id]);
    //   // 우클릭 일 때

    // 포커스가 1개일 때
    //      파일일 때
    //      폴더일 때
    // 포커스가 여러개일 때
    //      파일일 때
    //      폴더일 때

    // 파일 및 폴더 일때
    if (focusedIds.size === 0) {
      // File.contxetmenu()

      // 빈공간 일때
      // 폴더 추가
      // 파일 추가
      return [생성];
    } else if (focusedIds.size === 1) {
      // 포커스가 1개일 때 -> 수정 / 삭제
      [...focusedIds][0];
      const target = [...focusedIds][0];
      target;
      return [수정, 삭제];
    } else {
      // 포커스가 여러개일 때 -> 삭제
      return [삭제];
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="size-[200px] border-2"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      메뉴가 나와야함
      <div>삭제</div>
    </div>
  );
};

export default ContextMenu;
