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
  const hasError = !!params.error;

  async function loginAction(formData: FormData) {
    "use server";
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    await signIn("credentials", {
      username,
      password,
      redirectTo: "/dashboard",
    });
  }

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
          僅限團隊成員。如需帳號請聯絡管理員。
        </p>

        {hasError && (
          <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            帳號或密碼錯誤，請再試一次。
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-neutral-300 mb-1.5"
            >
              帳號
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-300 mb-1.5"
            >
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 font-medium text-white hover:opacity-90 transition-opacity"
          >
            登入
          </button>
        </form>

        <p className="mt-8 text-xs text-neutral-500 text-center">
          僅供團隊內部使用
        </p>
      </div>
    </main>
  );
}
