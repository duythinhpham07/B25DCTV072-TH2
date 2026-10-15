import type { Book } from "./types.ts";

// Tạo một thẻ sách bằng createElement + textContent (không dùng innerHTML)
function createBookCard(book: Book, isFavorite: boolean): HTMLElement {
  const card = document.createElement("article");
  card.className = "book-card";
  card.dataset.id = book.id;

  const genre = document.createElement("span");
  genre.className = "book-genre";
  genre.textContent = book.genre;

  const title = document.createElement("h3");
  title.className = "book-title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.textContent = `Tác giả: ${book.author}`;

  const year = document.createElement("p");
  year.textContent = `Năm xuất bản: ${book.year}`;

  const code = document.createElement("p");
  code.className = "book-code";
  code.textContent = `Mã sách: ${book.id}`;

  const actions = document.createElement("div");
  actions.className = "book-actions";

  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.dataset.action = "favorite";
  favBtn.className = isFavorite ? "btn btn-fav active" : "btn btn-fav";
  favBtn.textContent = isFavorite ? "❤ Đã thích" : "♡ Yêu thích";
  favBtn.setAttribute("aria-pressed", String(isFavorite));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.dataset.action = "delete";
  deleteBtn.className = "btn btn-delete";
  deleteBtn.textContent = "Xóa";

  actions.append(favBtn, deleteBtn);
  card.append(genre, title, author, year, code, actions);
  return card;
}

export function renderBooks(container: HTMLElement, books: Book[], favorites: Set<string>): void {
  container.replaceChildren();

  if (books.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Không có cuốn sách nào phù hợp.";
    container.append(empty);
    return;
  }

  for (const book of books) {
    container.append(createBookCard(book, favorites.has(book.id)));
  }
}

// Đổ danh sách thể loại vào thẻ <select>, giữ lại option đầu tiên ("Tất cả"/"Chọn")
export function renderGenreOptions(select: HTMLSelectElement, genres: string[]): void {
  const selected = select.value;
  const firstOption = select.options[0];
  select.replaceChildren(firstOption);

  for (const genre of genres) {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    select.append(option);
  }

  // Nếu thể loại đang chọn vẫn còn thì chọn lại
  select.value = genres.includes(selected) ? selected : "";
}
