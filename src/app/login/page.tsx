import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";
import { Film } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const params = await searchParams;
  const error = params.error;

  return (
    <main className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <div className="rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-semibold tracking-tight">
              Storyboard Studio
            </div>
            <div className="text-xs text-neutral-400">內部團隊工具</div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2">登入</h1>
        <p className="text-sm text-neutral-400 mb-8">
          僅限團隊成員。請使用授權的 Google 帳號登入。
        </p>

        {error === "AccessDenied" && (
          <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            此 Google 帳號不在團隊白名單。如需加入請聯絡管理員。
          </div>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 rounded-lg bg-white text-neutral-900 px-4 py-2.5 font-medium hover:bg-neutral-100 transition-colors"
          >
            <GoogleIcon />
            使用 Google 登入
          </button>
        </form>

        <p className="mt-8 text-xs text-neutral-500 text-center">
          登入即表示同意此工具僅供團隊內部使用
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
