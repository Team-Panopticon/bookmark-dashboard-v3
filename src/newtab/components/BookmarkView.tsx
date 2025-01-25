import { CSSProperties } from "react";
import { BookmarkType, type Bookmark } from "../../types/store";
import FolderImage from "../../assets/folder.svg";

type Props = {
  bookmark: Bookmark;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseUp?: React.MouseEventHandler<HTMLElement>;
  onDoubleClick?: (bookmark: Bookmark) => void;
  style?: CSSProperties;
  focused?: boolean;
};

/** @TODO favicon 그리기 (원래 코드에서 안옮겼음) */
const BookmarkView = ({
  bookmark,
  onMouseDown,
  onMouseUp,
  onDoubleClick,
  style,
  focused,
}: Props) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{
        ...style,
        gridRow: bookmark.row || "auto",
        gridColumn: bookmark.col || "auto",
        border: focused ? "1px solid black" : "",
      }}
      className="h-item w-item"
      onDoubleClick={() => onDoubleClick?.(bookmark)}
    >
      <button
        className="flex size-full flex-col items-center"
        style={{
          border: "1px solid transparent",
        }}
      >
        <div className="flex  flex-[2] items-center text-[48px] leading-[48px] text-yellow-500">
          {bookmark.type === BookmarkType.FOLDER ? (
            <img
              src={FolderImage}
              width={56}
              height={56}
              style={{ pointerEvents: "none" }}
            />
          ) : (
            <>{bookmark.title.charAt(0)}</>
          )}
        </div>
        <p className="line-clamp-2 flex-[1] transform-none overflow-hidden text-ellipsis break-words px-2 pb-1 text-xs leading-5 tracking-[.2px]">
          {bookmark.title}
        </p>
      </button>
    </div>
  );
};

export default BookmarkView;
