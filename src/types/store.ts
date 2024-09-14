export interface Item extends chrome.bookmarks.BookmarkTreeNode {
  row?: number | string;
  col?: number | string;
  type?: string;
}

export type modalInfo = {
  folderItem: Item;
  showFolder: boolean;
  zIndex: number;
};

export interface FolderItem {
  title: string;
  id: string;
}
