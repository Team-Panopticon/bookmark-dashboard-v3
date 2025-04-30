import SearchIcon from "../../../assets/search.svg";
<<<<<<< HEAD
=======
import { Z_INDEX } from "../../utils/constant";
>>>>>>> refs/rewritten/origin-main-3

interface Props {
  onClick: () => void;
}

const SearchButton = ({ onClick }: Props) => {
  return (
    <button
      className="fixed bottom-6 right-6 rounded-full border-2 border-gray-200 bg-white p-2 text-gray-800 shadow-md transition-colors hover:bg-gray-100"
<<<<<<< HEAD
=======
      style={{ zIndex: Z_INDEX.SEARCH }}
>>>>>>> refs/rewritten/origin-main-3
      onClick={onClick}
    >
      <img src={SearchIcon} width={24} />
    </button>
  );
};

export default SearchButton;
