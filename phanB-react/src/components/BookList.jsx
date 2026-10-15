import BookCard from "./BookCard";

function BookList({ books, favoriteIds, onToggleFavorite }) {
  if (books.length === 0) {
    return <p className="empty">Không có cuốn sách nào phù hợp.</p>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isFavorite={favoriteIds.includes(book.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}

export default BookList;
