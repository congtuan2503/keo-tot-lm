# KeototLM - Nền tảng ghép phòng thể thao đỉnh cao 🏆

KeototLM (viết tắt của Kèo Tốt) là nền tảng kết nối những người yêu thể thao, giúp bạn dễ dàng tìm kiếm đồng đội, ghép phòng, và tham gia các trận đấu thể thao (bóng đá, cầu lông, tennis, bóng rổ,...) một cách nhanh chóng. Điểm nhấn của KeototLM là **hệ thống đánh giá uy tín minh bạch**, giải quyết triệt để vấn đề "lệch trình độ" và "bùng kèo".

## ✨ Tính năng nổi bật

- **🔐 Xác thực người dùng (Authentication):** Đăng ký, đăng nhập an toàn bằng JWT (JSON Web Tokens). Lưu phiên đăng nhập thông minh với cơ chế LocalStorage hoạt động mượt mà trên môi trường iframe.
- **⚡️ Đăng kèo siêu tốc:** Chủ phòng (Host) có thể tạo kèo chỉ trong vài click: nhập môn thể thao, địa điểm, thời gian và số lượng người còn thiếu.
- **🔍 Bộ lọc tìm kiếm thông minh:** Tìm kèo dễ dàng thông qua bộ lọc chi tiết ở Dashboard (lọc theo môn, khu vực, ngày thi đấu, số người thiếu, và **đặc biệt là lọc theo trình độ của người tạo kèo**).
- **🛡️ Hệ thống đánh giá uy tín (Reputation System):** 
  - Thành viên tham gia kèo có thể chấm điểm (Rating từ 1-5 sao) và nhận xét thái độ, kỹ năng của nhau (ví dụ: có đi đúng giờ không, đá có fairplay không).
  - Điểm uy tín được hiển thị công khai trên hồ sơ và ngay ngoài thẻ (Card) ở trang chủ.
- **🛠️ Quản lý trận đấu:** Chủ phòng có toàn quyền Chỉnh sửa thông tin lịch trình, địa điểm hoặc Hủy/Xóa kèo dễ dàng với giao diện bảo vệ bằng hộp thoại cảnh báo (Alert Dialog).

## 💻 Công nghệ sử dụng (Tech Stack)

**Frontend:**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Hệ thống UI Components: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- Icon: [Lucide React](https://lucide.dev/)
- Định tuyến: `react-router`

**Backend:**
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) (Fullstack mode trong cùng repository)
- Cơ sở dữ liệu: [MongoDB](https://www.mongodb.com/) (thông qua `mongoose`)
- Bảo mật: `bcryptjs` (mã hóa mật khẩu), `jsonwebtoken` (Auth), `express-mongo-sanitize` (chống NoSQL Injection)

## 📖 Hướng dẫn sử dụng (User Guide)

1. **Bắt đầu:** Lần đầu vào trang web, hãy nhấn nút **Bắt đầu ngay** hoặc vòng qua trang Đăng ký (`/register`) để tạo tài khoản. Bạn cần khai báo mức độ kỹ năng (Beginner, Intermediate, Advanced) để người khác cân nhắc khi vào kèo.
2. **Tạo Kèo Tìm Đồng Đội:** Sau khi đăng nhập, hãy nhấn vào tab **"Đăng Kèo"**. Điền thông tin sân bãi và thời gian.
3. **Quản lý kèo của mình (Dành cho Chủ phòng):** Trong trang Chi tiết kèo, nếu bạn là chủ phòng, nút **Sửa** (Edit) và **Xóa** (Trash) sẽ xuất hiện. Bấm "Sửa" nếu bị đổi sân dời giờ; bấm "Xóa" nếu sân bị hủy (hệ thống sẽ hiển thị một thông báo màu đỏ để xác nhận tránh xóa nhầm).
4. **Tìm Kèo Để Chơi:** Tại tab **Dashboard**, dùng thanh tìm kiếm hoặc nút "Bộ lọc chi tiết" để kiếm kèo đá bóng, cầu lông, v.v. đúng ý bạn.
5. **Đánh Giá Người Chơi:** Sau khi gia nhập 1 kèo và trận đấu đã xong, bạn có thể bấm thẻ "Đánh giá uy tín" trên giao diện chi tiết người chơi cùng để thả sao và lại lời nhận xét giúp xây dựng cộng đồng trong sạch.


