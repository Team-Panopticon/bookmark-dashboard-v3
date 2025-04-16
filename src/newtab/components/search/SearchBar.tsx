import { ChangeEvent, useState } from "react";
import SearchIcon from "../../../assets/search.svg";
import { rootStore } from "../../store/rootStore";
import { Bookmark } from "../../../types/store";

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

const SearchBar = () => {
  const { bookmark } = rootStore();
  const [results, setResults] = useState<Bookmark[]>(
    searchBookmarks(bookmark, "")
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setResults(searchBookmarks(bookmark, value));
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
        <div className="mt-2 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white">
          {results.map((result, idx) => (
            <div
              key={idx}
              className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
            >
              <img src={result.url} alt="favicon" className="mr-3 size-5" />
              <span className="text-sm text-gray-800">{result.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
