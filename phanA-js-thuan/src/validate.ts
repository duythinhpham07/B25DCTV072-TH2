// Mỗi hàm trả về câu báo lỗi, hợp lệ thì trả về chuỗi rỗng
export type FieldName = "title" | "author" | "genre" | "year";

export function validateField(name: FieldName, value: string): string {
  const text = value.trim();
  const currentYear = new Date().getFullYear();

  switch (name) {
    case "title":
      if (text === "") return "Vui lòng nhập tên sách";
      if (text.length < 3) return "Tên sách phải có ít nhất 3 ký tự";
      return "";
    case "author":
      if (text === "") return "Vui lòng nhập tác giả";
      return "";
    case "genre":
      if (text === "") return "Vui lòng chọn thể loại";
      return "";
    case "year": {
      if (text === "") return "Vui lòng nhập năm xuất bản";
      const year = Number(text);
      if (!Number.isInteger(year)) return "Năm xuất bản phải là số nguyên";
      if (year < 1900 || year > currentYear) {
        return `Năm xuất bản phải từ 1900 đến ${currentYear}`;
      }
      return "";
    }
  }
}
