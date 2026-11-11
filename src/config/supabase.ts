import axios from 'axios';

// Cấu hình Supabase REST API & Public Key
export const SUPABASE_URL = 'https://noaqdxhlvbdfacdxvbxm.supabase.co/rest/v1';
export const SUPABASE_ANON_KEY = 'sb_publishable_yldt9wt4Ihe2oeRrZL8oAQ_Fcaz5oz1';

// Tạo Axios instance cấu hình sẵn headers cho Supabase
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

// Interceptor bắt lỗi mạng tập trung (để trả lời vấn đáp về Axios)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Axios API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
