# Storyboard Studio (Internal)

團隊內部 AI 分鏡生成工具。貼上劇本 → 30 秒拿到完整分鏡 + Kling / Seedance prompt。

## 技術棧

- **Next.js 16** (App Router, Turbopack)
- **Auth.js v5** (Google OAuth + email allowlist)
- **Anthropic Claude API** (backend, shared key)
- **Supabase** (Postgres + Storage, Day 2+)
- **Tailwind CSS 4** + **Lucide icons**
- **Vercel** (deploy)

## 本地開發

```bash
npm install
cp .env.example .env.local   # 填入金鑰
npm run dev
```

打開 http://localhost:3000

## 必要環境變數

```bash
AUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=           # console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_SECRET=
ANTHROPIC_API_KEY=          # console.anthropic.com/settings/keys
```

## Google OAuth 設定

1. [Google Cloud Console](https://console.cloud.google.com/) → 新建專案
2. APIs & Services → Credentials → Create OAuth Client ID
3. Application type: **Web application**
4. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`（本地）
   - `https://<你的網域>.vercel.app/api/auth/callback/google`（正式）

## 加團隊成員

編輯 `src/lib/allowlist.ts` → push → Vercel 自動部署。

## 部署到 Vercel

1. push 到 GitHub
2. vercel.com → Import Project → 選此 repo
3. Environment Variables 加入所有 `.env.local` 內容
4. Deploy

## 開發進度

- [x] Day 1 — 專案建立、Google OAuth、登入/儀表板雛形
- [ ] Day 2 — Supabase + 專案 CRUD
- [ ] Day 3 — 劇本輸入頁 + Claude API 串接
- [ ] Day 4 — 分鏡輸出 + 下載
- [ ] Day 5 — 圖片上傳 + UI 打磨
- [ ] Day 6 — RWD + 上線
