import type { Book } from "./types.ts";
import { getBooks, addBook, deleteBook } from "./api.ts";
import { getGenres, filterBooks } from "./filter.ts";
import { renderBooks, renderGenreOptions } from "./render.ts";
import { validateField, type FieldName } from "./validate.ts";
import { loadFavorites, saveFavorites, loadTheme, saveTheme, type Theme } from "./storage.ts";

// Hàm lấy phần tử, báo lỗi luôn nếu sai id để dễ sửa
function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Không tìm thấy phần tử ${selector}`);
  return el;
}

const bookList = $<HTMLDivElement>("#book-list");
const statusText = $<HTMLParagraphElement>("#status");
const searchInput = $<HTMLInputElement>("#search");
const genreFilter = $<HTMLSelectElement>("#genre-filter");
const favCount = $<HTMLElement>("#fav-count");
const themeToggle = $<HTMLButtonElement>("#theme-toggle");
const form = $<HTMLFormElement>("#book-form");
const formGenre = $<HTMLSelectElement>("#genre");
const formYear = $<HTMLInputElement>("#year");
const formMessage = $<HTMLParagraphElement>("#form-message");
const submitBtn = $<HTMLButtonElement>("#book-form button[type=submit]");

// Thể loại mặc định để form vẫn chọn được kể cả khi chưa tải được sách
const DEFAULT_GENRES = ["Văn học", "Khoa học", "Kỹ năng sống", "Lịch sử"];
const FIELDS: FieldName[] = ["title", "author", "genre", "year"];

let books: Book[] = [];
let isLoaded = false;
const favorites = loadFavorites();
// Id các sách đang xóa, tránh bấm Xóa 2 lần gửi DELETE 2 lần
const deletingIds = new Set<string>();

// ===== Hiển thị =====
function updateFavCount(): void {
  // Chỉ đếm những sách còn tồn tại trong danh sách
  const count = isLoaded ? books.filter((b) => favorites.has(b.id)).length : favorites.size;
  favCount.textContent = String(count);
}

function updateGenres(): void {
  renderGenreOptions(genreFilter, getGenres(books));
  const allGenres = new Set([...DEFAULT_GENRES, ...getGenres(books)]);
  renderGenreOptions(formGenre, [...allGenres]);
}

function render(): void {
  const result = filterBooks(books, searchInput.value, genreFilter.value);
  renderBooks(bookList, result, favorites);
  statusText.classList.remove("error");
  statusText.textContent = `Đang hiển thị ${result.length} / ${books.length} cuốn`;
  updateFavCount();
}

function showError(message: string): void {
  statusText.classList.add("error");
  statusText.textContent = message;
}

// ===== Tải dữ liệu =====
async function loadBooks(): Promise<void> {
  statusText.classList.remove("error");
  statusText.textContent = "Đang tải…";
  try {
    books = await getBooks();
    isLoaded = true;
    updateGenres();
    render();
  } catch (error) {
    console.error(error);
    showError("Không tải được danh sách sách. Kiểm tra kết nối mạng rồi tải lại trang.");
  }
}

// ===== Tìm kiếm + lọc =====
// Chưa tải xong thì chưa lọc, để không ghi đè dòng "Đang tải…" hoặc thông báo lỗi
function handleFilter(): void {
  if (isLoaded) render();
}
searchInput.addEventListener("input", handleFilter);
genreFilter.addEventListener("change", handleFilter);

// ===== Yêu thích + Xóa: event delegation trên cả danh sách =====
bookList.addEventListener("click", async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>("button[data-action]");
  if (!button) return;

  const card = button.closest<HTMLElement>(".book-card");
  const id = card?.dataset.id;
  const book = books.find((b) => b.id === id);
  if (!book) return;

  if (button.dataset.action === "favorite") {
    if (favorites.has(book.id)) {
      favorites.delete(book.id);
    } else {
      favorites.add(book.id);
    }
    saveFavorites(favorites);
    render();
  }

  if (button.dataset.action === "delete") {
    if (deletingIds.has(book.id)) return;
    if (!confirm(`Bạn có chắc muốn xóa sách "${book.title}"?`)) return;

    deletingIds.add(book.id);
    button.disabled = true;
    button.textContent = "Đang xóa…";
    try {
      await deleteBook(book.id);
      books = books.filter((b) => b.id !== book.id);
      favorites.delete(book.id);
      saveFavorites(favorites);
      updateGenres();
      render();
    } catch (error) {
      console.error(error);
      alert("Xóa sách thất bại, vui lòng thử lại.");
      button.disabled = false;
      button.textContent = "Xóa";
    } finally {
      deletingIds.delete(book.id);
    }
  }
});

// ===== Form thêm sách =====
function getInput(name: FieldName): HTMLInputElement | HTMLSelectElement {
  return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;
}

// Kiểm tra 1 ô và hiện lỗi ngay bên dưới ô đó
function checkField(name: FieldName): boolean {
  const input = getInput(name);
  const message = validateField(name, input.value);
  $<HTMLElement>(`#${name}-error`).textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", String(message !== ""));
  return message === "";
}

for (const name of FIELDS) {
  const input = getInput(name);
  // Báo lỗi ngay khi gõ / chọn
  input.addEventListener("input", () => {
    checkField(name);
    formMessage.textContent = "";
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Kiểm tra tất cả các ô (không dừng ở ô lỗi đầu tiên để hiện đủ lỗi)
  const results = FIELDS.map((name) => checkField(name));
  if (results.includes(false)) {
    formMessage.className = "form-message error";
    formMessage.textContent = "Vui lòng sửa các lỗi ở trên.";
    getInput(FIELDS[results.indexOf(false)]).focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Đang thêm…";
  formMessage.textContent = "";

  try {
    const newBook = await addBook({
      title: getInput("title").value.trim(),
      author: getInput("author").value.trim(),
      genre: getInput("genre").value,
      year: Number(getInput("year").value),
    });
    // Sách mới hiện ở đầu danh sách, bỏ lọc để chắc chắn nhìn thấy
    books.unshift(newBook);
    searchInput.value = "";
    genreFilter.value = "";
    updateGenres();
    render();
    form.reset();
    formMessage.className = "form-message success";
    formMessage.textContent = `Đã thêm sách "${newBook.title}".`;
  } catch (error) {
    console.error(error);
    formMessage.className = "form-message error";
    formMessage.textContent = "Thêm sách thất bại, vui lòng thử lại.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Thêm sách";
  }
});

// ===== Chế độ sáng / tối =====
function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  themeToggle.textContent = theme === "dark" ? "☀ Bật chế độ sáng" : "🌙 Bật chế độ tối";
}

let theme = loadTheme();
applyTheme(theme);
themeToggle.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme(theme);
  saveTheme(theme);
});

// ===== Khởi động =====
formYear.min = "1900";
formYear.max = String(new Date().getFullYear());
updateGenres();
updateFavCount();
loadBooks();
