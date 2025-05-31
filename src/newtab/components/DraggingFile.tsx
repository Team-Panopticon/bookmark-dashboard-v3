import { useState, useEffect } from 'react';
import { useEventHandler } from '../hooks/useEventHandler';
import { rootStore } from '../store/rootStore';
import { Z_INDEX } from '../utils/constant';
import BookmarkView from './BookmarkView';

const DraggingFile = () => {
  const { dragAndDrop = {} } = rootStore();
  const {
    bookmarkEventHandler: { handleMouseUpBookmark },
  } = useEventHandler({});
  const { fileElement, offsetBetweenStartPointAndFileLeftTop, bookmark } =
    dragAndDrop;

  const [{ x, y }, setDraggingFilePosition] = useState<{
    x?: number;
    y?: number;
  }>({ x: undefined, y: undefined });

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (!fileElement || !offsetBetweenStartPointAndFileLeftTop) return;

      setDraggingFilePosition({
        x: event.pageX - offsetBetweenStartPointAndFileLeftTop.x,
        y: event.pageY - offsetBetweenStartPointAndFileLeftTop.y,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!fileElement || !offsetBetweenStartPointAndFileLeftTop) return;

      setDraggingFilePosition({
        x: event.pageX - offsetBetweenStartPointAndFileLeftTop.x,
        y: event.pageY - offsetBetweenStartPointAndFileLeftTop.y,
      });
    };

    const handleMouseUp = () => {
      setDraggingFilePosition({
        x: undefined,
        y: undefined,
      });

      document.removeEventListener('mousedown', handleMouseDown);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [fileElement, offsetBetweenStartPointAndFileLeftTop]);

  if (!bookmark) return null;
  if (x === undefined && y === undefined) return null;

  return (
    <BookmarkView
      isDragging={true}
      bookmark={bookmark}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        zIndex: Z_INDEX.DRAGGING_FILE,
        pointerEvents: 'none',
      }}
      onMouseUp={(e) => {
        handleMouseUpBookmark(e, bookmark);
      }}
    />
  );
};

export default DraggingFile;
