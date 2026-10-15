// Lưu danh sách id sách yêu thích và chế độ sáng/tối vào localStorage
const FAVORITES_KEY = "favoriteBookIds";
const THEME_KEY = "theme";

export type Theme = "light" | "dark";

export function loadFavorites(): Set<string> {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    const ids: unknown = data ? JSON.parse(data) : [];
    return new Set(Array.isArray(ids) ? ids.map(String) : []);
  } catch {
    // Dữ liệu bị lỗi thì coi như chưa có sách yêu thích nào
    return new Set();
  }
}

export function saveFavorites(favorites: Set<string>): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
}

export function loadTheme(): Theme {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  // Chưa chọn lần nào thì theo cài đặt của máy
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
}
