import { ChangeEvent, useEffect, useRef, useState } from "react";
import SearchIcon from "../../../assets/search.svg";
import FolderImage from "../../../assets/folder.svg";
import { rootStore } from "../../store/rootStore";
import { Bookmark, BookmarkType } from "../../../types/store";
import { useEventHandler } from "../../hooks/useEventHandler";
import { Z_INDEX } from "../../utils/constant";
import { getFaviconURI } from "../../utils/getFaviconURI";

function isFolder(
  bookmark: Bookmark
): bookmark is Bookmark & { children: Bookmark[] } {
  return Array.isArray(bookmark.children);
}

const searchBookmarks = (bookmark: Bookmark, keyword: string) => {
  const results: Bookmark[] = [];

  const doSearch = (bookmark: Bookmark, keyword: string) => {
    if (bookmark.title && bookmark.title.includes(keyword)) {
      results.push(bookmark);
    }

    if (isFolder(bookmark)) {
      bookmark.children.forEach((child) => doSearch(child, keyword));
    }
  };

  doSearch(bookmark, keyword);
  return results;
};

interface Props {
  hideSearchBar: () => void;
  searchText: string;
  onChangeSearchInput: (value: string) => void;
}

const SearchBar = ({
  hideSearchBar,
  searchText,
  onChangeSearchInput,
}: Props) => {
  const { bookmark } = rootStore();
  const {
    bookmarkEventHandler: { handleDoubleClickBookmark: handleClickBookmark },
  } = useEventHandler({});
  const [results, setResults] = useState<Bookmark[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchText != "") {
      setResults(searchBookmarks(bookmark, searchText));
    } else {
      setResults([]);
    }
  }, [bookmark, searchText]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChangeSearchInput(value);
  };

  const onClickBookmark = (bookmark: Bookmark) => {
    handleClickBookmark(bookmark);
    hideSearchBar();
  };

  return (
    <div
      className='absolute left-1/2 top-[20%] flex max-h-[60vh] w-[600px] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-gray-300 bg-[rgba(253,253,253,0.5)]  backdrop-blur-2xl'
      style={{
        boxShadow:
          "0 4px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        zIndex: Z_INDEX.SEARCH,
      }}
    >
      <div className='flex h-[52px] items-center px-3 py-2'>
        <img
          className='opacity-70'
          src={SearchIcon}
          width={24}
          alt='Search Icon'
        />
        <input
          ref={searchInputRef}
          type='text'
          placeholder='Search'
          value={searchText}
          onChange={handleInputChange}
          className='w-full bg-transparent pl-1 text-[26px] font-medium leading-[26px] text-gray-800 outline-none placeholder:text-gray-500'
        />
      </div>
      {results.length > 0 && (
        <div className='relative flex max-h-96 flex-1 flex-col overflow-hidden border-t p-2'>
          <div className='scrollbar-thin-custom h-full overflow-y-auto'>
            {results.map((result, idx) => (
              <div
                key={idx}
                className='flex cursor-pointer items-center rounded-md px-2.5 py-1.5 hover:bg-black/10'
                onClick={() => onClickBookmark(result)}
              >
                {result.type === BookmarkType.FOLDER ? (
                  <img src={FolderImage} className='mr-3 size-5' />
                ) : (
                  <img
                    src={getFaviconURI(result.url ?? "", 32)}
                    className='mr-3 size-5'
                  />
                )}
                <span className='text-xs text-gray-800'>{result.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
