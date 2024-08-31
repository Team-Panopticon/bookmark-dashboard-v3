import type { FC } from "react";
import { bookshelfModalStore } from "../store/bookshelfModal";
import Bookshelf from "./Bookshelf";

const BookshelfModalContainer: FC = () => {
  const { bookshelfModals } = bookshelfModalStore();
  return (
    <div>
      {Object.entries(bookshelfModals).map(([key, value]) => {
        return (
          <div
            className="absolute flex size-[500px] rounded border bg-white"
            style={{
              top: "50%",
              left: "50%",
            }}
            key={key}
          >
            <Bookshelf id={value.id} />
          </div>
        );
      })}
    </div>
  );
};

export default BookshelfModalContainer;
