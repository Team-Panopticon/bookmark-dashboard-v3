import { CSSProperties } from "react";
import { type File } from "../../types/store";

type Props = {
  file: File;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  style?: CSSProperties;
};

/** @TODO favicon 그리기 (원래 코드에서 안옮겼음) */
const FileView = ({ file, onMouseDown, style }: Props) => {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        ...style,
        gridRow: file.row || "auto",
        gridColumn: file.col || "auto",
      }}
      className="h-item w-item"
    >
      <button
        className="flex size-full flex-col items-center"
        style={{
          border: "1px solid transparent",
        }}
      >
        <div className="flex  flex-[2] items-center text-[48px] leading-[48px] text-yellow-500">
          {file.title.charAt(0)}
        </div>
        <p className="line-clamp-2 flex-[1] transform-none overflow-hidden text-ellipsis break-words px-2 pb-1 text-xs leading-5 tracking-[.2px]">
          {file.title}
        </p>
      </button>
    </div>
  );
};

export default FileView;
