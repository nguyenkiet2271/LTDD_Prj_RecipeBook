# 🍳 CHEFMATE - SỔ TAY NẤU ĂN THÔNG MINH
> **BÀI TẬP LỚN MÔN LẬP TRÌNH THIẾT BỊ DI ĐỘNG**  
> **Nhóm thực hiện:** Nhóm 20
23649011-Nguyễn Đỗ Anh Kiệt
23681041-Phan Hoàng Nhật Huy
> **Nền tảng:** React Native (Expo) • Tamagui UI • Supabase REST API • Redux Toolkit • Gemini AI

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN

### 1. Khởi động ứng dụng trong môi trường phát triển:
Mở terminal tại thư mục dự án `D:\LTDD_Prj` và chạy:
```bash
npx expo start
```
- Màn hình terminal sẽ xuất hiện một **mã QR**.
- Mở ứng dụng **Expo Go** trên điện thoại thật (tải miễn phí trên App Store / Google Play).
- Quét mã QR để mở app chạy trực tiếp trên điện thoại của bạn!

---

### 2. Xuất file cài đặt APK (Phân phối qua Internet):
Chạy lệnh EAS Build:
```bash
npx eas-cli build -p android --profile preview
```
Hệ thống Expo Cloud sẽ tự động biên dịch và tạo một đường link tải file `.apk`. Bạn gửi link này hoặc mã QR cho giảng viên tải về cài trực tiếp vào điện thoại.

---

## 🏗️ CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT ARCHITECTURE)

```text
D:\LTDD_Prj
├── tamagui.config.ts         # Cấu hình Tamagui Theme & Responsive Breakpoints
├── app.json                  # Cấu hình Expo (orientation: "default", icon, package)
├── eas.json                  # Cấu hình build APK Android
├── src
│   ├── config
│   │   └── supabase.ts       # Axios instance & Supabase REST API credentials
│   ├── types
│   │   └── recipe.ts         # TypeScript Interfaces (Recipe, Category, Navigation)
│   ├── services
│   │   ├── recipeService.ts  # Các hàm gọi API Supabase bằng Axios (CRUD món ăn)
│   │   └── geminiService.ts  # Tích hợp AI Gemini Flash gợi ý món từ tủ lạnh
│   ├── redux
│   │   ├── store.ts          # Redux Store cấu hình configureStore
│   │   ├── favoriteSlice.ts  # Redux Slice quản lý Món yêu thích
│   │   ├── shoppingSlice.ts  # Redux Slice quản lý Danh sách đi chợ
│   │   └── themeSlice.ts     # Redux Slice quản lý Chế độ Dark Mode toàn cầu
│   ├── components
│   │   ├── RecipeCard.tsx    # Card món ăn Tamagui Responsive
│   │   └── CategoryPills.tsx # Thanh lọc danh mục món ăn
│   ├── navigation
│   │   ├── BottomTabs.tsx    # 4 tab chính: Khám phá, AI Đầu bếp, Đi chợ, Yêu thích
│   │   └── RootNavigator.tsx # Stack điều hướng chính giữa các màn hình
│   └── screens
│       ├── HomeScreen.tsx           # Trang chủ: Tìm kiếm, lọc danh mục, Grid món ăn
│       ├── RecipeDetailScreen.tsx   # Chi tiết món, dinh dưỡng, thêm vào đi chợ
│       ├── CookingStepScreen.tsx    # Nấu ăn từng bước chữ to + Kitchen Timer
│       ├── AIChefScreen.tsx         # Đầu bếp AI dọn tủ lạnh
│       ├── ShoppingListScreen.tsx   # Danh sách đi chợ với checkbox
│       ├── FavoritesScreen.tsx      # Quản lý món yêu thích từ Redux
│       ├── CreateRecipeScreen.tsx   # Đóng góp công thức mới lên Supabase (CRUD)
│       └── ProfileScreen.tsx        # Hồ sơ, toggle Dark mode, bảng đối chiếu tiêu chí
└── App.tsx                   # Bọc Redux Provider + TamaguiProvider + Navigation
```

---
