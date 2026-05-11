// 團隊成員帳號清單
//
// 加新成員：
// 1. 在 terminal 跑：node scripts/hash-password.mjs <你想設的密碼>
// 2. 複製輸出的 hash
// 3. 在下面的 USERS 加一行 { username, passwordHash, name }
// 4. commit + push，Vercel 會自動部署

import bcrypt from "bcryptjs";

export interface TeamUser {
  username: string;
  passwordHash: string;
  name: string;
}

export const USERS: TeamUser[] = [
  // 預設管理員（密碼：admin123，請第一次部署後立刻改）
  {
    username: "admin",
    passwordHash:
      "$2b$10$yYycq/vg3dDJpltyigaJf.wXnyqC5SJWOBNftKHV07Ytkz3g5wHeK",
    name: "管理員",
  },
];

export async function verifyCredentials(
  username: string,
  password: string
): Promise<TeamUser | null> {
  const user = USERS.find((u) => u.username === username.toLowerCase().trim());
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return user;
}
