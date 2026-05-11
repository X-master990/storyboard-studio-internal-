import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Film, LogOut, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1.5">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">
              Storyboard Studio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-400 hidden sm:inline">
              {session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                登出
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">我的專案</h1>
            <p className="text-sm text-neutral-400 mt-1">
              貼上劇本，30 秒拿到分鏡與 Kling / Seedance prompt
            </p>
          </div>
          <button
            disabled
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            新建專案
          </button>
        </div>

        <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 px-6 py-16 text-center">
          <Film className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-300 font-medium">尚無專案</p>
          <p className="text-sm text-neutral-500 mt-1">
            新建專案功能會在 Day 3 開放
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-neutral-800/60 bg-neutral-900/30 p-5">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            開發進度
          </p>
          <ul className="text-sm space-y-1.5 text-neutral-300">
            <li>✅ Day 1 — 專案建立、Vercel 部署、Google OAuth</li>
            <li className="text-neutral-500">⬜ Day 2 — 專案列表 + Supabase</li>
            <li className="text-neutral-500">⬜ Day 3 — 劇本輸入 + Claude API</li>
            <li className="text-neutral-500">⬜ Day 4 — 輸出頁 + 下載</li>
            <li className="text-neutral-500">⬜ Day 5 — 圖片上傳 + UI 打磨</li>
            <li className="text-neutral-500">⬜ Day 6 — RWD + 正式上線</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
