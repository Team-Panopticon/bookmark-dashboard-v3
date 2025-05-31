import { useEffect, useRef, useState } from 'react';
import SearchBar from './SearchBar';
import SearchButton from './SearchButton';

const Search = () => {
  const [show, setShow] = useState(false);
  const [searchText, setSearchText] = useState('');
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

    document.addEventListener('mousedown', handleClickOutside, true);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside, true);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key != 'Escape') {
        return;
      }

      if (searchText == '') {
        hideSearchBar();
      } else {
        setSearchText('');
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [searchText]);

  const toggleSearchBar = () => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const hideSearchBar = () => {
    setShow(false);
  };

  const onChangeSearchInput = (value: string) => {
    setSearchText(value);
  };

  return (
    <>
      {show && (
        <div ref={searchBarRef}>
          <SearchBar
            hideSearchBar={hideSearchBar}
            searchText={searchText}
            onChangeSearchInput={onChangeSearchInput}
          />
        </div>
      )}
      <div ref={searchButtonRef}>
        <SearchButton onClick={toggleSearchBar} />
      </div>
    </>
  );
};

export default Search;
