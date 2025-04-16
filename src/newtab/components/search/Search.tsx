import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SearchButton from "./SearchButton";

const Search = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const isOutsideOfSearchBar =
        searchBarRef.current &&
        !searchBarRef.current.contains(e.target as Node);
      const isOutsideOfSearchButton =
        searchButtonRef.current &&
        !searchButtonRef.current.contains(e.target as Node);

      if (isOutsideOfSearchBar && isOutsideOfSearchButton) {
        setShowSearchBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearchBar(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const onSearchButtonClick = () => {
    setShowSearchBar(true);
  };

  return (
    <>
      {showSearchBar && (
        <div ref={searchBarRef}>
          <SearchBar />
        </div>
      )}
      <div ref={searchButtonRef}>
        <SearchButton onClick={onSearchButtonClick} />
      </div>
    </>
  );
};

export default Search;
