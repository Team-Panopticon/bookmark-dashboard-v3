import {useEffect, useRef, useState, type FC} from "react";
import Bookshelf from "./Bookshelf";
import Moveable from "react-moveable";
import {Bookmark} from "../../types/store";
import {rootStore} from "../store/rootStore";
import CloseIcon from "../../assets/close.svg";
import BackIcon from "../../assets/back.svg";
import BackIconLG from "../../assets/back_lg.svg";
import ForwardIcon from "../../assets/forward.svg";
import ForwardIconLG from "../../assets/forward_lg.svg";

const FolderManager: FC = () => {
  const {
    folder: {folders},
  } = rootStore();

  return (
    <div>
      {Object.entries(folders).map(([timestamp, value]) => {
        return (
          <Folder
            key={timestamp}
            id={value.id}
            zIndex={value.zIndex}
            timestamp={timestamp}
          />
        );
      })}
    </div>
  );
};

const Folder = ({
  id,
  zIndex,
  timestamp,
}: {
  id: string;
  zIndex: number;
  timestamp: string;
}) => {
  const {getSubtree, bookmark, closeFolder, focusFolder} = rootStore();
  const targetRef = useRef<HTMLDivElement>(null);
  const dragTargetRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<string[]>([id]);
  const [folder, setFolder] = useState<Bookmark | null>(null);
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
  const navigateTo = ({id: folderId}: Bookmark) => {
    const newHistory = history.slice(0, historyCursor + 1); // 현재 이후 기록 제거
    setHistory([...newHistory, folderId]);
    setHistoryCursor(newHistory.length); // 새로운 위치로 이동
  };

  useEffect(() => {
    setFolder(getSubtree(history[historyCursor]));
  }, [historyCursor, getSubtree, setFolder, history, bookmark]);

  const canGoBack = !!history[historyCursor - 1];
  const canGoForward = !!history[historyCursor + 1];

  return (
    <div className="container">
      <div
        onMouseDown={() => {
          focusFolder(timestamp);
        }}
        className="absolute flex size-[500px] flex-col rounded-lg border border-gray-200 bg-neutral-50 shadow-2xl"
        style={{
          top: "10px",
          left: 0,
          maxWidth: "auto",
          maxHeight: "auto",
          minWidth: "200px",
          minHeight: "auto",
          zIndex,
        }}
        ref={targetRef}
      >
        <div
          ref={dragTargetRef}
          className="flex h-12 w-full items-center justify-between  rounded-t-lg border-b border-transparent p-2 hover:border-gray-200 hover:shadow-sm"
        >
          <div className="flex w-full items-center">
            <button
              onClick={() => {
                closeFolder(timestamp);
              }}
              className="group ml-2 flex aspect-square size-3 items-center justify-center rounded-full bg-red-500 text-center text-[9px] font-semibold transition-all duration-300"
            >
              <img
                className="flex items-center justify-center opacity-0 duration-500 group-hover:opacity-100"
                src={CloseIcon}
              />
            </button>
            <button
              className={`ml-2 flex size-8 shrink-0 items-center justify-center rounded-md border-none transition-all  duration-500
                ${canGoBack && "hover:bg-gray-200"}`}
              disabled={!canGoBack}
              onClick={goBack}
            >
              <img
                className="mr-[-8px] w-5"
                src={canGoBack ? BackIcon : BackIconLG}
              />
            </button>
            <button
              className={`flex size-8 shrink-0 items-center justify-center rounded-md border-none transition-all duration-500
                ${canGoForward && "hover:bg-gray-200"}`}
              disabled={!canGoForward}
              onClick={goForward}
            >
              <img
                className="mr-[-2px] w-5"
                src={canGoForward ? ForwardIcon : ForwardIconLG}
              />
            </button>
            <div className="ml-2 overflow-hidden text-ellipsis font-semibold">
              {folder?.title}
            </div>
          </div>
        </div>
        {folder && (
          <Bookshelf
            folder={folder}
            navigateTo={navigateTo}
            timestamp={timestamp}
          />
        )}
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
