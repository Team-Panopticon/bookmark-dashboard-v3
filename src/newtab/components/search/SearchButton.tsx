import SearchIcon from '../../../assets/search.svg';
import { Z_INDEX } from '../../utils/constant';

interface Props {
  onClick: () => void;
}

const SearchButton = ({ onClick }: Props) => {
  return (
    <button
      className='fixed bottom-6 right-6 rounded-full border-2 border-gray-200 bg-white p-2 text-gray-800 shadow-md transition-colors hover:bg-gray-100'
      style={{ zIndex: Z_INDEX.SEARCH }}
      onClick={onClick}
    >
      <img src={SearchIcon} width={24} />
    </button>
  );
};

export default SearchButton;
