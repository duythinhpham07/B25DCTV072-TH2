import { useState } from "react";
import Header from "./components/Header";
import Section from "./components/Section";
import GenreFilter from "./components/GenreFilter";
import BookList from "./components/BookList";
import Footer from "./components/Footer";
import books from "./data/books";
import "./App.css";

const ALL = "Tất cả";
// Danh sách thể loại không trùng, lấy bằng Set
const genres = [ALL, ...new Set(books.map((book) => book.genre))];

function App() {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(ALL);
  const [theme, setTheme] = useState("light");

  // Hàm này được truyền xuống BookCard qua props
  function handleToggleFavorite(id) {
    if (favoriteIds.includes(id)) {
      setFavoriteIds(favoriteIds.filter((favId) => favId !== id));
    } else {
      setFavoriteIds([...favoriteIds, id]);
    }
  }

  function handleToggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const filteredBooks =
    selectedGenre === ALL ? books : books.filter((book) => book.genre === selectedGenre);

  return (
    <div className={`app ${theme}`}>
      <Header
        name="Thư viện lớp AIoT"
        favoriteCount={favoriteIds.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
      <main className="container">
        <Section title="Thể loại">
          <GenreFilter genres={genres} selected={selectedGenre} onSelect={setSelectedGenre} />
        </Section>
        <Section title="Danh sách sách">
          <p className="status">
            Đang hiển thị {filteredBooks.length} / {books.length} cuốn
          </p>
          <BookList
            books={filteredBooks}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        </Section>
      </main>
      <Footer author="Phạm Duy Thịnh - B25DCTV072" />
    </div>
  );
}

export default App;
