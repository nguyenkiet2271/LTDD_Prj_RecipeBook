# 🗄️ DỮ LIỆU CƠ SỞ DỮ LIỆU (DATABASE) - CHEFMATE

> **BÀI TẬP LỚN MÔN LẬP TRÌNH THIẾT BỊ DI ĐỘNG**  
> **Nhóm thực hiện:** Nhóm 20 (Nguyễn Đỗ Anh Kiệt - Phan Hoàng Nhật Huy)  
> **Hệ quản trị CSDL:** PostgreSQL (chạy trên Supabase BaaS)

---

## 📁 Danh sách các file trong thư mục:

1. **`schema_and_data.sql`**:
   - File kịch bản SQL hoàn chỉnh chứa:
     - Câu lệnh tạo bảng `categories` và `recipes`
     - Cấu hình khóa chính, khóa ngoại, RLS policies
     - Toàn bộ dữ liệu 5 danh mục và 14 món ăn chi tiết (kèm nguyên liệu định lượng và các bước nấu ăn dạng JSONB).
   - **Cách dùng:** Mở Supabase -> SQL Editor -> Dán toàn bộ nội dung file này vào và bấm **Run**.

2. **`database_export.json`**:
   - File dữ liệu dạng JSON thuần túy, thích hợp để import vào các công cụ kiểm thử API như Postman, hoặc dùng cho các hệ cơ sở dữ liệu NoSQL khác nếu cần.

---

## 📊 Thống kê dữ liệu:
- **Bảng categories:** 5 danh mục (Món Sáng, Món Trưa, Món Chay, Tráng Miệng, Eat-Clean)
- **Bảng recipes:** 14 món ăn đầy đủ hình ảnh HD, định lượng nguyên liệu, các bước làm, calo, độ khó và thời gian nấu.
