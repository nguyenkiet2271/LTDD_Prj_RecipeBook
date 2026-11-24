import axios from 'axios';

// Cấu hình Supabase: URL dự án, REST API (database) và Auth API (đăng nhập/đăng ký)
export const SUPABASE_PROJECT_URL = 'https://dmneifloncahaeiuidmc.supabase.co';
export const SUPABASE_URL = `${SUPABASE_PROJECT_URL}/rest/v1`;
export const SUPABASE_AUTH_URL = `${SUPABASE_PROJECT_URL}/auth/v1`;
export const SUPABASE_ANON_KEY = 'sb_publishable_TQgVcDwnfXMQyu7S1I45GA_DRjtjhTi';

// ---------------------------------------------------------------------------
// Access token của người dùng đang đăng nhập (được authService cập nhật).
// Khi chưa đăng nhập thì dùng anon key như trước đây.
// ---------------------------------------------------------------------------
let currentAccessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};
export const getAccessToken = () => currentAccessToken;

// Hàm làm mới token – được authService đăng ký để tránh import vòng tròn
type RefreshHandler = () => Promise<string | null>;
let refreshHandler: RefreshHandler | null = null;
export const registerRefreshHandler = (handler: RefreshHandler) => {
  refreshHandler = handler;
};

// Tạo Axios instance cấu hình sẵn headers cho Supabase REST (database)
export const apiClient = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation', // Yêu cầu Supabase trả về bản ghi sau khi thêm/sửa
  },
  timeout: 10000, // Timeout 10s
});

// Axios instance riêng cho Supabase Auth (GoTrue)
export const authClient = axios.create({
  baseURL: SUPABASE_AUTH_URL,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Mọi request database đều gắn token của người dùng đang đăng nhập
apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${currentAccessToken ?? SUPABASE_ANON_KEY}`;
  return config;
});

// Interceptor bắt lỗi mạng tập trung (để trả lời vấn đáp về Axios)
// + Tự làm mới token và gọi lại 1 lần nếu server báo token hết hạn (401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error?.config;
    if (error?.response?.status === 401 && refreshHandler && original && !original._retried) {
      original._retried = true;
      try {
        const newToken = await refreshHandler();
        if (newToken) {
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        }
      } catch {
        // rơi xuống phần báo lỗi bên dưới
      }
    }
    console.error('Axios API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
