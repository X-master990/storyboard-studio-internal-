import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Film, LogOut } from "lucide-react";
import Workspace from "./workspace";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1.5">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">
              Storyboard Studio
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400 hidden sm:inline">
              {session.user.name ?? session.user.email}
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Workspace />
      </main>
    </div>
  );
}
