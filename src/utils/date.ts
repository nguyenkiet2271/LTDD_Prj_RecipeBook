// Tiện ích ngày tháng cho màn Tủ lạnh. Hạn dùng lưu dạng chuỗi 'YYYY-MM-DD' (giờ địa phương).

const pad = (n: number) => String(n).padStart(2, '0');

export const toISODate = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseISODate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// Ngày hôm nay + n ngày (ISO)
export const addDaysISO = (days: number): string => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

// Số ngày còn lại tới hạn (âm = đã hết hạn)
export const daysUntil = (iso: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseISODate(iso).getTime() - today.getTime()) / 86400000);
};

// 'YYYY-MM-DD' -> 'dd/mm/yyyy'
export const formatVN = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

// 'dd/mm/yyyy' (hoặc d/m/yyyy, dd-mm-yyyy) -> 'YYYY-MM-DD'; sai định dạng / ngày không tồn tại -> null
export const parseVN = (text: string): string | null => {
  const m = text.trim().match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return toISODate(d);
};
