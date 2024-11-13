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
    <div onMouseDown={onMouseDown} style={style}>
      <div
        className="flex justify-center bg-none"
        style={{
          gridRow: file.row || "auto",
          gridColumn: file.col || "auto",
        }}
      >
        <div className="flex h-full flex-col items-center gap-2">
          <button
            className="h-item w-item"
            style={{
              padding: "8px",
              border: "1px solid transparent",
              width: "70px",
              height: "90px",
            }}
          >
            <div className="text-[48px] text-yellow-500">
              {file.title.charAt(0)}
            </div>
            <p className="line-clamp-2 transform-none overflow-hidden text-ellipsis break-words text-xs leading-5 tracking-[.2px]">
              {file.title}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileView;
