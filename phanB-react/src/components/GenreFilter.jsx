// Mỗi thể loại là một nút, nút đang chọn có class "active"
function GenreFilter({ genres, selected, onSelect }) {
  return (
    <div className="genre-filter">
      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          className={genre === selected ? "btn btn-genre active" : "btn btn-genre"}
          onClick={() => onSelect(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default GenreFilter;
