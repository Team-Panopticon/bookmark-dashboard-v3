import { CSSProperties, useEffect, useRef, useState } from "react";
import { BookmarkType, type Bookmark } from "../../types/store";
import FolderImage from "../../assets/folder.svg";

type Props = {
  bookmark: Bookmark;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseUp?: React.MouseEventHandler<HTMLElement>;
  onDoubleClick?: (bookmark: Bookmark) => void;
  onSave?: (title: string) => Promise<void>;
  style?: CSSProperties;
  focused?: boolean;
  isEdit?: boolean;
  setIsEdit?: (isEdit: boolean) => void;
};

/** @TODO favicon 그리기 (원래 코드에서 안옮겼음) */
const BookmarkView = ({
  bookmark,
  onMouseDown,
  onMouseUp,
  onDoubleClick,
  onSave,
  style,
  focused,
  isEdit,
  setIsEdit,
}: Props) => {
  const [newTitle, setNewTitle] = useState<string>(bookmark.title);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isEdit) {
      inputRef.current?.focus();
    }
  }, [isEdit]);

  useEffect(() => {
    setNewTitle(bookmark.title);
  }, [bookmark.title]);

  const saveTitle = async () => {
    if (!isEdit) {
      return;
    }
    setNewTitle(newTitle.trim());
    setIsEdit?.(false);
    try {
      await onSave?.(newTitle.trim());
    } catch {
      setNewTitle(bookmark.title);
    }
    containerRef.current?.focus();
  };

  return (
    <div
      onMouseDown={async (e) => {
        // saveTitle에서 focus를 변경하므로 onMouseDown 처리를 먼저 하지 않으면 currentTarget이 사라져 에러 발생
        onMouseDown?.(e);
        // mouseDown에서 saveTitle을 해주는 이유: edit 상태에서 자기자신 클릭 시 blur에서 저장해줄 수 없으므로 mouseDown에서 저장
        await saveTitle();
      }}
      onMouseUp={onMouseUp}
      style={{
        ...style,
        gridRow: bookmark.row || "auto",
        gridColumn: bookmark.col || "auto",
        border: focused ? "1px solid black" : "",
      }}
      onKeyDown={(e) => {
        if (e.code === "Enter" && isEdit === false) {
          setIsEdit?.(true);
        }
      }}
      className="h-item w-item overflow-visible"
      onDoubleClick={() => onDoubleClick?.(bookmark)}
    >
      <button
        className="relative flex size-full flex-col items-center"
        ref={containerRef}
        style={{
          border: "1px solid transparent",
        }}
      >
        <div className="flex  flex-[2] items-center text-[48px] leading-[48px] text-yellow-500">
          {bookmark.type === BookmarkType.FOLDER ? (
            <div className="flex flex-col">
              <img
                src={FolderImage}
                width={56}
                height={56}
                style={{ pointerEvents: "none" }}
              />
            </div>
          ) : (
            <>{bookmark.title.charAt(0)}</>
          )}
        </div>
        {!isEdit ? (
          <p className="line-clamp-2 flex-[1] transform-none overflow-hidden text-ellipsis break-words px-2 pb-1 text-xs leading-5 tracking-[.2px]">
            {newTitle}
          </p>
        ) : (
          <textarea
            ref={inputRef}
            className="h-[140px] w-[150px] flex-[1] transform-none break-words px-2 pb-1 text-xs leading-5 tracking-[.2px]"
            onChange={(e) => {
              setNewTitle(e.target.value.replace(/[\n|\r\n|\r|]/g, ""));
            }}
            rows={3}
            value={newTitle}
            onBlur={(e) => {
              // Escape 키로 인한 blur 이벤트 방지
              if (e.relatedTarget === containerRef.current) {
                e.preventDefault();
                return;
              }
              saveTitle();
            }}
            onKeyDown={async (e) => {
              e.stopPropagation();

              if (e.code === "Enter") {
                saveTitle();
                return;
              }

              if (e.code === "Escape") {
                e.preventDefault();
                setNewTitle(bookmark.title);
                setIsEdit?.(false);
                containerRef.current?.focus();
                return;
              }
            }}
          />
        )}
      </button>
    </div>
  );
};

export default BookmarkView;
