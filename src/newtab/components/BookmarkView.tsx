import { CSSProperties, useEffect, useRef, useState } from "react";
import { BookmarkType, type Bookmark } from "../../types/store";
import FolderImage from "../../assets/folder.svg";
import { getFaviconURI } from "../utils/getFaviconURI";

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
  isDragging?: boolean;
  isDesktop?: boolean;
  isCurrentFocusCursor?: boolean;
};
declare module "react" {
  interface CSSProperties {
    "field-sizing"?: "fixed" | "content";
    fieldSizing?: "fixed" | "content";
  }
}

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
  isDragging,
  isDesktop,
  isCurrentFocusCursor,
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

  useEffect(() => {
    if (isCurrentFocusCursor) {
      containerRef.current?.focus();
    }
  }, [isCurrentFocusCursor]);

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
  const getTrimmedTitle = (title: string) => {
    const MAX_LENGTH = 23;
    const TAIL_LENGTH = 5;
    const ELLIPSIS = "...";

    if (title.length <= MAX_LENGTH) return title;

    const headLength = MAX_LENGTH - TAIL_LENGTH - ELLIPSIS.length;
    const head = title.slice(0, headLength);
    const tail = title.slice(-TAIL_LENGTH);

    return `${head}${ELLIPSIS}${tail}`;
  };
  const [showImgIcon, setShowImgIcon] = useState(true);

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
        opacity: isDragging ? 0.8 : 1,
      }}
      onKeyDown={(e) => {
        if (e.code === "Enter" && isEdit === false) {
          setIsEdit?.(true);
        }
      }}
      className="h-item w-item select-none overflow-visible"
      onDoubleClick={() => onDoubleClick?.(bookmark)}
    >
      <button
        className="relative flex size-full cursor-default flex-col items-center gap-1 bg-transparent focus:outline-none"
        ref={containerRef}
      >
        <div
          className={`flex size-[70px] shrink-0 grow-0 items-center justify-center rounded`}
          style={{
            ...(bookmark.type === BookmarkType.PAGE &&
              !showImgIcon && {
                backgroundImage: "url(not-found.png)",
                backgroundSize: "contain",
              }),
            ...(isDragging && {
              filter: "drop-shadow(0px 6px 24px rgb(0 0 0 / 0.2))",
            }),
            ...(focused && {
              backgroundColor: isDesktop ? "#00000046" : "#E6E6E6",
              boxShadow: isDesktop
                ? "inset 0px 0px 0px 1.4px #b8b8b8d6"
                : "none",
              overflow: "hidden",
            }),
          }}
        >
          {bookmark.type === BookmarkType.FOLDER ? (
            <div className={`flex h-full items-center `}>
              <img
                src={FolderImage}
                width={64}
                height={64}
                style={{ pointerEvents: "none" }}
              />
            </div>
          ) : (
            <div className="flex size-[95%] items-center justify-center rounded text-[10px] text-gray-800">
              {!showImgIcon && bookmark.title.slice(0, 3)}

              {showImgIcon && (
                <img
                  className="pointer-events-none"
                  src={getFaviconURI(bookmark.url ?? "", 52)}
                  onLoad={(e) => {
                    const targetImg = e.target as HTMLImageElement;
                    if (targetImg.width <= 16 || targetImg.height <= 16) {
                      setShowImgIcon(false);
                    }
                  }}
                  alt=""
                />
              )}
            </div>
          )}
        </div>

        <div className="break-all text-center leading-[13px] text-black dark:text-white">
          {!isEdit ? (
            <span
              style={{
                fontSize: "12px",
                display: "inline",
                padding: "1px 3.5px",
                color: isDesktop ? "white" : "black",
                boxDecorationBreak: "clone",
                textShadow: isDesktop
                  ? "0px 1px 0.8px rgba(0, 0, 0, 0.4),0px 2px 8px rgba(0, 0, 0, 0.4)"
                  : "",
                ...((isDragging || focused) && {
                  background: "#0A82FF",
                  filter: 'url("goo.svg#goo")',
                  color: "white",
                  textShadow: "none",
                }),
              }}
              className="font-semibold"
            >
              {getTrimmedTitle(newTitle)}
            </span>
          ) : (
            <textarea
              ref={inputRef}
              style={{
                fieldSizing: "content",
              }}
              className="max-h-9 resize-none overflow-hidden break-words rounded-sm border border-[#5BA1FA] bg-[#B3D7FE] px-0.5 text-black caret-white outline-none ring ring-[#81B5FB]"
              onChange={(e) => {
                setNewTitle(e.target.value.replace(/[\n|\r\n|\r|]/g, ""));
              }}
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
        </div>
      </button>
    </div>
  );
};

export default BookmarkView;
