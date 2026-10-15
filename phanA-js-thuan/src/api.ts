import type { Book, NewBook } from "./types.ts";

// Đổi thành link resource "books" trên mockapi.io của mình
const API_URL = "https://YOUR_PROJECT_ID.mockapi.io/api/v1/books";

export async function getBooks(): Promise<Book[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Lỗi ${res.status} khi tải danh sách sách`);
  }
  return res.json();
}

export async function addBook(book: NewBook): Promise<Book> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) {
    throw new Error(`Lỗi ${res.status} khi thêm sách`);
  }
  return res.json();
}

export async function deleteBook(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Lỗi ${res.status} khi xóa sách`);
  }
}
