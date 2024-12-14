import { useEffect, useRef, useState, type FC } from "react";
import { folderStore } from "../store/folder";
import Bookshelf from "./Bookshelf";
import Moveable from "react-moveable";
import { File } from "../../types/store";
import { bookmarkStore } from "../store/bookmarkStore";

const FolderManager: FC = () => {
  const { folders } = folderStore();

  return (
    <div>
      {Object.entries(folders).map(([timestampId, value]) => {
        return (
          <Folder
            key={timestampId}
            id={value.id}
            zIndex={value.zIndex}
            timestampId={timestampId}
          />
        );
      })}
    </div>
  );
};

const Folder = ({
  id,
  zIndex,
  timestampId,
}: {
  id: string;
  zIndex: number;
  timestampId: string;
}) => {
  const { getSubtree } = bookmarkStore();
  // const folder = getSubtree(id);
  const targetRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);
  const { closeFolder, focusFolder } = folderStore();

  const [history, setHistory] = useState<string[]>([id]);
  const [folder, setFolder] = useState<File | null>(null);
  const [historyCursor, setHistoryCursor] = useState<number>(0); // 현재 위치 인덱스

  // "뒤로 가기" 기능
  const goBack = () => {
    // check : ui에서도 막아줘야함.
    if (historyCursor > 0) {
      setHistoryCursor(historyCursor - 1);
    }
  };

  // "앞으로 가기" 기능
  const goForward = () => {
    if (historyCursor < history.length - 1) {
      setHistoryCursor(historyCursor + 1);
    }
  };

  // 폴더 이동 시 호출
  const navigateTo = ({ id: folderId }: File) => {
    const newHistory = history.slice(0, historyCursor + 1); // 현재 이후 기록 제거
    setHistory([...newHistory, folderId]);
    setHistoryCursor(newHistory.length); // 새로운 위치로 이동
  };

  useEffect(() => {
    setFolder(getSubtree(history[historyCursor]));
  }, [historyCursor, getSubtree, setFolder, history]);

  return (
    <div className="container">
      <div
        onMouseDown={() => {
          focusFolder(timestampId);
        }}
        className="absolute flex size-[500px] flex-col rounded-lg border bg-neutral-50 shadow-2xl"
        style={{
          top: "10px",
          left: 0,
          maxWidth: "auto",
          maxHeight: "auto",
          minWidth: "auto",
          minHeight: "auto",
          zIndex,
        }}
        ref={targetRef}
      >
        <div
          ref={dragTargetRef}
          className="flex h-12 w-full items-center justify-between rounded-t-lg bg-neutral-300 p-2 hover:border-b "
        >
          <div className="flex">
            <button className="w-4 border-none bg-none" onClick={goBack}>
              {"<"}
            </button>
            <button className="w-4 border-none bg-none" onClick={goForward}>
              {">"}
            </button>
            <div>{folder?.title}</div>
          </div>
          <button
            onClick={() => {
              closeFolder(timestampId);
            }}
            className="aspect-square size-4 rounded-full bg-red-500 text-center text-[10px]"
          ></button>
        </div>
        {folder && <Bookshelf folder={folder} navigateTo={navigateTo} />}
      </div>
      <Moveable
        target={targetRef}
        dragTarget={dragTargetRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        resizable={true}
        startDragRotate={0}
        throttleDragRotate={0}
        onDrag={(e) => {
          e.target.style.transform = e.transform;
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.transform = e.drag.transform;
        }}
      />
    </div>
  );
};

export default FolderManager;
