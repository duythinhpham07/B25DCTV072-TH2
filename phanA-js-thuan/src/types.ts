// Kiểu dữ liệu của một cuốn sách (id do mockapi tự sinh, dạng chuỗi)
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
}

// Dữ liệu gửi lên khi thêm sách (chưa có id)
export type NewBook = Omit<Book, "id">;
