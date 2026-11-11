# 🍳 CHEFMATE - SỔ TAY NẤU ĂN THÔNG MINH
> **BÀI TẬP LỚN MÔN LẬP TRÌNH THIẾT BỊ DI ĐỘNG**  
> **Nhóm thực hiện:** 2 Sinh viên  
> **Nền tảng:** React Native (Expo) • Tamagui UI • Supabase REST API • Redux Toolkit • Gemini AI

---

## 📋 ĐỐI CHIẾU 100% YÊU CẦU ĐỀ BÀI CỦA GIẢNG VIÊN

| Yêu cầu đề bài | Cách nhóm đã triển khai trong mã nguồn | Vị trí file trong dự án |
| :--- | :--- | :--- |
| **Khoảng 10 chức năng (10-15 màn hình)** | 12 màn hình & tính năng: Khám phá, Tìm kiếm, Lọc danh mục, Chi tiết món, Nấu ăn bếp (Step-by-Step), Timer đếm ngược, AI gợi ý món, Đi chợ (Shopping list), Món yêu thích, Đóng góp công thức, Hồ sơ cá nhân. | `src/screens/*` |
| **Có backend** | Kết nối trực tiếp cơ sở dữ liệu **Supabase PostgreSQL** với bảng `recipes` và `categories`. | `src/config/supabase.ts` |
| **Dùng Axios để get API** | Sử dụng thư viện `axios` có cấu hình `baseURL`, `timeout` và `interceptors` xử lý lỗi tập trung. | `src/services/recipeService.ts` |
| **Dùng Expo Project** | Dự án xây dựng trên **Expo SDK 58** với TypeScript chuẩn chỉ. | `app.json`, `package.json` |
| **Build & phân phối qua internet** | Cấu hình **EAS Build** (`eas.json`) để xuất file cài đặt Android `.apk` tải trực tiếp qua link mạng. | `eas.json` |
| **AI basic** | Tích hợp **Google Gemini 1.5 Flash API**: Tính năng *"Smart Fridge Chef"* (Nhập nguyên liệu có sẵn trong tủ lạnh $\rightarrow$ AI sáng tạo món ăn). | `src/services/geminiService.ts` |
| **ReduxToolkit** | Quản lý Global State cho tính năng **Món yêu thích** (`favoriteSlice.ts`) và **Danh sách đi chợ** (`shoppingSlice.ts`). | `src/redux/*` |
| **Chạy trên thiết bị thật (real device)** | Chạy tức thì qua **Expo Go** (quét mã QR) hoặc cài đặt qua file `.apk`. | `App.tsx` |
| **Responsive (Tablet / iPad / Xoay ngang)** | Tự động thích ứng kích thước màn hình bằng Breakpoints Tamagui: Hiển thị 1 cột trên điện thoại và **Grid 2 cột** khi xoay ngang hoặc trên iPad. | `tamagui.config.ts`, `HomeScreen.tsx` |
| **Animation basic** | Hiệu ứng đếm ngược thời gian (Timer), chuyển cảnh trượt màn hình mượt mà, phản hồi chạm nút. | `CookingStepScreen.tsx` |
| **TamaGUI** | Sử dụng toàn bộ hệ thống component của Tamagui: `Card`, `YStack`, `XStack`, `Text`, `Input`, `Button`, `Separator`. | `src/components/*` |
| **Link GitHub (code)** | Quản lý mã nguồn theo chuẩn Git, có commit rõ ràng, chia file mô-đun khoa học. | `.git` |

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
│   │   └── shoppingSlice.ts  # Redux Slice quản lý Danh sách đi chợ
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

## 🎯 CẨM NANG VẤN ĐÁP BẢO VỆ ĐẠT ĐIỂM TỐI ĐA

Khi giảng viên hỏi:
1. **"Tại sao nhóm em dùng Axios kết hợp Redux Toolkit?"**  
   *Trả lời:* "Dạ thưa thầy/cô, nhóm em dùng **Axios** để giao tiếp với máy chủ Supabase vì Axios có cơ chế `interceptors` tập trung bắt lỗi mạng và tự động cấu hình header `apikey`. Còn **Redux Toolkit** nhóm em dùng để quản lý trạng thái toàn cục (Global State) cho tính năng **Món yêu thích** và **Danh sách đi chợ**. Khi người dùng bấm thả tim ở trang Chi tiết, Redux sẽ cập nhật store ngay lập tức để trang Yêu thích đồng bộ dữ liệu mà không cần tải lại trang."
2. **"Tính năng AI hoạt động như thế nào?"**  
   *Trả lời:* "Nhóm em tích hợp Google Gemini Flash API thông qua Prompt Engineering. Ứng dụng gửi danh sách các nguyên liệu người dùng chọn trong tủ lạnh đến AI và yêu cầu trả về định dạng JSON nghiêm ngặt để frontend parse thành các thẻ công thức nấu ăn."
3. **"Làm sao ứng dụng hiển thị tốt khi xoay ngang hoặc trên iPad?"**  
   *Trả lời:* "Nhóm em khai báo `"orientation": "default"` trong `app.json` và sử dụng media breakpoint của Tamagui. Khi chiều rộng màn hình lớn hơn 768px, layout tự động chuyển sang dạng Grid 2 cột giúp không gian hiển thị rộng rãi và chuyên nghiệp."
