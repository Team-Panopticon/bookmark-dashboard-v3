export enum FileType {
  FOLDER = "FOLDER",
  BOOKMARK = "BOOKMARK",
}

/** @TODO: row, col, type의 optional을 제거 */
export interface File extends chrome.bookmarks.BookmarkTreeNode {
  row?: number | string;
  col?: number | string;
  type?: FileType;
}

export type modalInfo = {
  folderItem: File;
  showFolder: boolean;
  zIndex: number;
};

export type Bookshelf = File;
