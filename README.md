# Storyboard Studio (Internal)

團隊內部 AI 分鏡生成工具。貼上劇本 → 30 秒拿到完整分鏡 + Kling / Seedance prompt。

## 技術棧

- **Next.js 16** (App Router, Turbopack)
- **Auth.js v5** (帳號密碼登入，bcrypt 加密)
- **Anthropic Claude API**
- **Supabase** (Day 2+)
- **Tailwind CSS 4** + **Lucide icons**
- **Vercel**

## 本地開發

```bash
npm install
cp .env.example .env.local
# 編輯 .env.local 填入 AUTH_SECRET
npm run dev
```

打開 http://localhost:3000

預設帳號：`admin` / `admin123`（部署後請立刻改）

## 必要環境變數

```bash
AUTH_SECRET=$(openssl rand -base64 32)
ANTHROPIC_API_KEY=          # console.anthropic.com/settings/keys
```

## 加 / 改團隊成員

### 加新成員
1. terminal 跑：
   ```bash
   npm run hash-password 你想設的密碼
   ```
2. 複製輸出的 hash
3. 編輯 `src/lib/users.ts`，在 `USERS` 加一行：
   ```ts
   {
     username: "alice",
     passwordHash: "$2b$10$...剛複製的 hash...",
     name: "Alice",
   },
   ```
4. commit + push，Vercel 自動部署

### 改密碼
產新 hash → 換掉舊的 → push

### 刪成員
從 `USERS` array 移掉 → push

## 部署到 Vercel

1. push 到 GitHub
2. vercel.com → Import Project
3. Environment Variables 加：
   - `AUTH_SECRET`（任意 32+ 字元的隨機字串）
   - `ANTHROPIC_API_KEY`（之後再加也行）
4. Deploy

## 開發進度

- [x] Day 1 — 專案建立、帳號密碼登入、登入/儀表板雛形
- [ ] Day 2 — Supabase + 專案 CRUD
- [ ] Day 3 — 劇本輸入頁 + Claude API 串接
- [ ] Day 4 — 分鏡輸出 + 下載
- [ ] Day 5 — 圖片上傳 + UI 打磨
- [ ] Day 6 — RWD + 上線
