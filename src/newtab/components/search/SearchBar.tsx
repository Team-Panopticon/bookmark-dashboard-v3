import { ChangeEvent, useState } from "react";
import SearchIcon from "../../../assets/search.svg";
import FolderImage from "../../../assets/folder.svg";
import { rootStore } from "../../store/rootStore";
import { Bookmark, BookmarkType } from "../../../types/store";
import { useEventHandler } from "../../hooks/useEventHandler";
import { FAVICON_PREFIX } from "../../utils/constant";

const searchBookmarks = (bookmark: Bookmark, keyword: string) => {
  const results: Bookmark[] = [];

  const doSearch = (bookmark: Bookmark, keyword: string) => {
    if (bookmark.title && bookmark.title.includes(keyword)) {
      results.push(bookmark);
    }

    if (Array.isArray(bookmark.children)) {
      bookmark.children.forEach((child) => doSearch(child, keyword));
    }
  };

  doSearch(bookmark, keyword);
  return results;
};

interface Props {
  hideSearchBar: () => void;
}

const SearchBar = ({ hideSearchBar }: Props) => {
  const { bookmark } = rootStore();
  const {
    bookmarkEventHandler: { handleDoubleClickBookmark: handleClickBookmark },
  } = useEventHandler({});
  const [results, setResults] = useState<Bookmark[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value != "") {
      setResults(searchBookmarks(bookmark, value));
    } else {
      setResults([]);
    }
  };

  const onClickBookmark = (bookmark: Bookmark) => {
    handleClickBookmark(bookmark);
    hideSearchBar();
  };

  return (
    <div className="absolute left-1/2 top-[20%] flex max-h-[60vh] w-full max-w-2xl -translate-x-1/2 flex-col overflow-hidden">
      <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm">
        <img src={SearchIcon} width={24} alt="Search Icon" />
        <input
          type="text"
          placeholder="Search"
          onChange={handleInputChange}
          className="w-full bg-transparent pl-1 text-lg text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>
      {results.length > 0 && (
        <div className="relative mt-2 flex max-h-96 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="h-full overflow-y-auto">
            {results.map((result, idx) => (
              <div
                key={idx}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                onClick={() => onClickBookmark(result)}
              >
                {result.type === BookmarkType.FOLDER ? (
                  <img src={FolderImage} className="mr-3 size-5" />
                ) : (
                  <img
                    src={FAVICON_PREFIX + result.url}
                    className="mr-3 size-5"
                  />
                )}
                <span className="text-xs text-gray-800">{result.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
