function BookCard({ book, isFavorite, onToggleFavorite }) {
  return (
    <article className="book-card">
      <span className="book-genre">{book.genre}</span>
      <h3 className="book-title">{book.title}</h3>
      <p>Tác giả: {book.author}</p>
      <p>Năm xuất bản: {book.year}</p>
      <p className="book-code">Mã sách: {book.id}</p>
      <div className="book-actions">
        <button
          type="button"
          className={isFavorite ? "btn btn-fav active" : "btn btn-fav"}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(book.id)}
        >
          {isFavorite ? "❤ Đã thích" : "♡ Yêu thích"}
        </button>
      </div>
    </article>
  );
}

export default BookCard;
