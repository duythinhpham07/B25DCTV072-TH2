function Header({ name, favoriteCount, theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <h1>📚 {name}</h1>
        <div className="header-right">
          <p className="fav-count">
            ❤ Yêu thích: <strong>{favoriteCount}</strong>
          </p>
          <button type="button" className="btn btn-outline" onClick={onToggleTheme}>
            {theme === "dark" ? "☀ Bật chế độ sáng" : "🌙 Bật chế độ tối"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
