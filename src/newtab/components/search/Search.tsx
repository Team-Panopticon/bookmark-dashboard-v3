import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import SearchButton from "./SearchButton";

const Search = () => {
  const [show, setShow] = useState(false);
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
        hideSearchBar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideSearchBar();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const showSearchBar = () => {
    setShow(true);
  };

  const hideSearchBar = () => {
    setShow(false);
  };

  return (
    <>
      {show && (
        <div ref={searchBarRef}>
          <SearchBar hideSearchBar={hideSearchBar} />
        </div>
      )}
      <div ref={searchButtonRef}>
        <SearchButton onClick={showSearchBar} />
      </div>
    </>
  );
};

export default Search;
