// 團隊成員 email 白名單
// 之後加新成員直接編輯這個 array，重新部署即可

export const ALLOWED_EMAILS: string[] = [
  "yangccagency@gmail.com",
  // 之後加新成員在這邊新增 email
];

export function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}
