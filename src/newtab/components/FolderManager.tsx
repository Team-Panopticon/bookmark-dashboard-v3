import { type FC } from 'react';
import { rootStore } from '../store/rootStore';

import Folder from './Folder';

const FolderManager: FC = () => {
  const {
    folder: { folders },
  } = rootStore();

  return (
    <div>
      {Object.entries(folders).map(([timestamp, value]) => {
        return (
          <Folder
            key={timestamp}
            id={value.id}
            zIndex={value.zIndex}
            timestamp={timestamp}
          />
        );
      })}
    </div>
  );
};

export default FolderManager;
