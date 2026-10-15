import type { Book } from "./types.ts";

// Bỏ dấu tiếng Việt để gõ "dac nhan tam" vẫn tìm ra "Đắc nhân tâm"
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

// Lấy danh sách thể loại không trùng bằng Set
export function getGenres(books: Book[]): string[] {
  const genres = new Set(books.map((book) => book.genre));
  return [...genres].sort((a, b) => a.localeCompare(b, "vi"));
}

// Kết hợp 2 điều kiện: tên sách chứa từ khóa VÀ đúng thể loại
export function filterBooks(books: Book[], keyword: string, genre: string): Book[] {
  const key = normalize(keyword);
  return books.filter((book) => {
    const matchTitle = normalize(book.title).includes(key);
    const matchGenre = genre === "" || book.genre === genre;
    return matchTitle && matchGenre;
  });
}
