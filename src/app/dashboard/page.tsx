import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { LogOut, LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Welcome card */}
        <div className="card text-left">
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-badge flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(67,97,238,0.15)" }}
            >
              <LayoutDashboard size={20} className="text-accent-blue" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold mb-1">Dashboard geliyor!</h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Giriş başarılı. Bir sonraki adımda KPI kartları, grafikler ve tüm sayfalar
                buraya eklenecek.
              </p>
              <div className="mt-3">
                <span className="badge-blue">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out form */}
        <form action="/api/auth/signout" method="POST">
          <button type="submit" className="btn-ghost mx-auto w-auto px-6">
            <LogOut size={15} />
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  );
}
