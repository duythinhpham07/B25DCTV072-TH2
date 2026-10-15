# Thực hành 2 - Thư viện lớp AIoT

- Sinh viên: Phạm Duy Thịnh - B25DCTV072
- Môn: Lập trình Web

Trang web cho thư viện của lớp: xem danh sách sách, tìm theo tên, lọc theo thể loại, đánh dấu sách yêu thích, thêm và xóa sách.

## Cấu trúc thư mục

```
phanA-js-thuan/          Phần A - DOM thuần, viết bằng TypeScript
  index.html             giao diện (header, main, section, form)
  mockapi-books.json     12 cuốn sách mẫu để dán lên mockapi
  src/
    main.ts              file chính: gắn sự kiện, gọi các module
    api.ts               fetch GET / POST / DELETE lên mockapi
    filter.ts            tìm kiếm + lọc, lấy thể loại bằng Set
    render.ts            tạo thẻ sách bằng createElement, textContent
    validate.ts          kiểm tra dữ liệu form
    storage.ts           lưu yêu thích + chế độ sáng/tối vào localStorage
    types.ts             kiểu Book
    style.css
phanB-react/             Phần B - React (Vite)
  src/
    App.jsx              giữ state: yêu thích, thể loại đang chọn, sáng/tối
    data/books.js        dữ liệu sách
    components/          Header, Section, GenreFilter, BookList, BookCard, Footer
```

## Cách chạy

Cần cài Node.js. Mỗi phần chạy riêng:

```bash
cd phanA-js-thuan
npm install
npm run dev
```

```bash
cd phanB-react
npm install
npm run dev
```

Phần A dùng mockapi.io, đường dẫn API nằm ở biến `API_URL` trong `phanA-js-thuan/src/api.ts`. Resource `books` có các trường `id` (mockapi tự sinh), `title`, `author`, `genre`, `year`; dữ liệu ban đầu lấy từ `mockapi-books.json`.

## Chức năng đã làm

**Phần A**
- Thẻ semantic, bố cục Flexbox, lưới sách 3 cột trên máy tính, 2 cột trên máy tính bảng, 1 cột trên điện thoại.
- Tải sách bằng `fetch` + `async/await`, hiện "Đang tải…" và thông báo khi lỗi.
- Tìm theo tên ngay khi gõ (gõ không dấu vẫn tìm được), lọc theo thể loại, hiện "Đang hiển thị x / y cuốn".
- Nút Yêu thích và Xóa dùng event delegation (chỉ gắn 1 sự kiện click cho cả danh sách). Số yêu thích lưu vào localStorage. Xóa có hỏi xác nhận và gửi DELETE lên mockapi.
- Form thêm sách báo lỗi dưới từng ô khi gõ và khi bấm gửi; hợp lệ thì gửi POST và sách mới hiện ở đầu danh sách.

**Phần B**
- Chia component, truyền dữ liệu bằng props, danh sách có `key`, `Section` dùng `children`.
- App giữ state danh sách yêu thích và truyền hàm `handleToggleFavorite` xuống BookCard.
- Lọc theo thể loại bằng các nút bấm.

**Nâng cao:** Phần A viết bằng TypeScript, nút Xóa gọi DELETE lên mockapi, cả hai phần đều có chế độ sáng/tối.

## So sánh Phần A và Phần B

| | Phần A - DOM thuần | Phần B - React |
|---|---|---|
| Cách nghĩ | Mệnh lệnh: tự chỉ ra từng bước thay đổi DOM | Khai báo: mô tả giao diện theo state, React tự cập nhật DOM |
| Tạo giao diện | `createElement`, `textContent`, `append` từng phần tử | Viết JSX, chia thành các component |
| Dữ liệu | Biến thường (`books`, `favorites`), đổi xong phải tự gọi `render()` | `useState`, gọi `setState` là giao diện tự vẽ lại |
| Sự kiện | `addEventListener`, dùng event delegation và `data-id` để biết bấm vào sách nào | `onClick` gắn thẳng trên nút, truyền hàm xuống con qua props |
| Tái sử dụng | Hàm `createBookCard` dùng lại được nhưng HTML và JS tách rời | Mỗi component gói cả giao diện và logic, dùng lại như một thẻ HTML |
| Ưu điểm | Không cần thư viện, hiểu rõ trình duyệt hoạt động thế nào | Code gọn và dễ đọc hơn khi giao diện lớn, ít lỗi quên cập nhật |
| Nhược điểm | Dễ quên cập nhật chỗ này chỗ kia (số yêu thích, dòng trạng thái...) | Phải học thêm JSX, props, state; cần bước build |

Nhận xét: với trang nhỏ, DOM thuần vẫn làm được nhưng mỗi lần dữ liệu đổi phải tự nhớ cập nhật mọi chỗ liên quan. Ở React chỉ cần đổi state, mọi chỗ dùng state đó (header, danh sách, nút) đều tự cập nhật, nên khi trang lớn dần thì React dễ quản lý hơn.
