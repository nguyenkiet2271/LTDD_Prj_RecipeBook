import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  authClient,
  apiClient,
  registerRefreshHandler,
  setAccessToken,
} from '../config/supabase';
import { AuthUser } from '../types/recipe';

const SESSION_KEY = 'chefmate_auth_session';

export interface StoredSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // giây (unix)
  user: AuthUser;
}

export interface SignUpResult {
  session: StoredSession | null;
  needsConfirmation: boolean;
}

// -------------------- Tiện ích --------------------

const mapUser = (raw: any): AuthUser => ({
  id: raw.id,
  email: raw.email ?? '',
  fullName:
    raw.user_metadata?.full_name ||
    raw.user_metadata?.name ||
    (raw.email ? String(raw.email).split('@')[0] : 'Đầu bếp'),
});

const mapSession = (raw: any): StoredSession => ({
  access_token: raw.access_token,
  refresh_token: raw.refresh_token,
  expires_at: raw.expires_at ?? Math.floor(Date.now() / 1000) + (raw.expires_in ?? 3600),
  user: mapUser(raw.user),
});

// Chuyển lỗi của Supabase Auth / mạng thành thông báo tiếng Việt dễ hiểu
export const getAuthErrorMessage = (error: any): string => {
  if (!error?.response) {
    return 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.';
  }
  const data = error.response.data ?? {};
  const code: string = data.error_code || data.code || '';
  const msg: string = String(data.msg || data.message || data.error_description || '').toLowerCase();

  if (code === 'invalid_credentials' || msg.includes('invalid login')) {
    return 'Email hoặc mật khẩu không đúng.';
  }
  if (code === 'email_not_confirmed' || msg.includes('not confirmed')) {
    return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư để xác nhận tài khoản.';
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.';
  }
  if (code === 'weak_password' || msg.includes('password should')) {
    return 'Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.';
  }
  if (code === 'validation_failed' || msg.includes('valid email') || msg.includes('invalid email')) {
    return 'Địa chỉ email không hợp lệ.';
  }
  if (code === 'signup_disabled') {
    return 'Hệ thống đang tạm khóa đăng ký tài khoản mới.';
  }
  if (code.includes('rate_limit') || error.response.status === 429) {
    return 'Bạn thao tác quá nhanh. Vui lòng đợi một lát rồi thử lại.';
  }
  return data.msg || data.message || data.error_description || 'Đã xảy ra lỗi. Vui lòng thử lại.';
};

// -------------------- Lưu phiên đăng nhập --------------------

export const saveSession = async (session: StoredSession) => {
  setAccessToken(session.access_token);
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('Không lưu được phiên đăng nhập', e);
  }
};

export const clearSession = async () => {
  setAccessToken(null);
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch {
    // bỏ qua
  }
};

export const loadSession = async (): Promise<StoredSession | null> => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
};

// -------------------- Gọi Supabase Auth --------------------

// Đăng ký tài khoản mới
export const signUp = async (
  fullName: string,
  email: string,
  password: string
): Promise<SignUpResult> => {
  const res = await authClient.post('/signup', {
    email,
    password,
    data: { full_name: fullName },
  });
  const data = res.data;

  // Supabase trả user "giả" (identities rỗng) khi email đã tồn tại và bật xác nhận email
  if (data?.user?.identities?.length === 0 || data?.identities?.length === 0) {
    const err: any = new Error('user_already_exists');
    err.response = { status: 422, data: { error_code: 'user_already_exists' } };
    throw err;
  }

  // Tắt "Confirm email" => có session ngay. Bật => chỉ có user, phải xác nhận email trước.
  if (data?.access_token) {
    const session = mapSession(data);
    await saveSession(session);
    return { session, needsConfirmation: false };
  }
  return { session: null, needsConfirmation: true };
};

// Đăng nhập bằng email + mật khẩu
export const signIn = async (email: string, password: string): Promise<StoredSession> => {
  const res = await authClient.post('/token?grant_type=password', { email, password });
  const session = mapSession(res.data);
  await saveSession(session);
  return session;
};

// Đăng xuất: báo server hủy phiên (nếu lỗi mạng vẫn xóa phiên ở máy)
export const signOut = async (): Promise<void> => {
  const session = await loadSession();
  try {
    if (session) {
      await authClient.post(
        '/logout',
        {},
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
    }
  } catch {
    // không sao: phiên ở máy vẫn bị xóa
  } finally {
    await clearSession();
  }
};

// Làm mới access token bằng refresh token (chống gọi trùng)
let refreshing: Promise<StoredSession | null> | null = null;
let onSessionExpired: (() => void) | null = null;
export const setSessionExpiredHandler = (fn: () => void) => {
  onSessionExpired = fn;
};

export const refreshSession = (): Promise<StoredSession | null> => {
  if (refreshing) return refreshing;
  refreshing = (async () => {
    const stored = await loadSession();
    if (!stored) return null;
    try {
      const res = await authClient.post('/token?grant_type=refresh_token', {
        refresh_token: stored.refresh_token,
      });
      const session = mapSession(res.data);
      await saveSession(session);
      return session;
    } catch (error: any) {
      // Refresh token bị từ chối => phiên hết hạn thật sự; lỗi mạng thì giữ nguyên phiên
      const status = error?.response?.status;
      if (status === 400 || status === 401 || status === 403) {
        await clearSession();
        onSessionExpired?.();
        return null;
      }
      throw error;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
};

registerRefreshHandler(async () => (await refreshSession())?.access_token ?? null);

// Khôi phục phiên khi mở app
export const restoreSession = async (): Promise<StoredSession | null> => {
  const stored = await loadSession();
  if (!stored) return null;

  setAccessToken(stored.access_token);
  const nowSec = Math.floor(Date.now() / 1000);
  if (stored.expires_at - nowSec > 60) return stored;

  try {
    return await refreshSession();
  } catch {
    // Mất mạng lúc mở app: vẫn cho vào bằng phiên đã lưu, request sau sẽ tự refresh
    return stored;
  }
};

// -------------------- Dữ liệu hồ sơ trong database --------------------

// Đếm số công thức do người dùng này đăng (cột recipes.author_id)
export const countMyRecipes = async (userId: string): Promise<number> => {
  const res = await apiClient.get(`/recipes?select=id&author_id=eq.${userId}`);
  return Array.isArray(res.data) ? res.data.length : 0;
};
