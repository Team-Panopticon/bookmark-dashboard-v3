export enum BookmarkType {
  FOLDER = "FOLDER",
  PAGE = "PAGE",
}

// bookmar - page
//         - folder
export interface Bookmark extends chrome.bookmarks.BookmarkTreeNode {
  row?: number | string;
  col?: number | string;
  type?: BookmarkType;
  children?: Bookmark[];
}

export type modalInfo = {
  folderItem: Bookmark;
  showFolder: boolean;
  zIndex: number;
};

export type Bookshelf = Bookmark;

export interface Folders {
  [key: string]: { zIndex: number; id: string };
}
