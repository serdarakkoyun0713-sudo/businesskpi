"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { register } from "@/app/(auth)/kayit/actions";
import Link from "next/link";

const passwordRules = [
  { label: "En az 6 karakter", check: (p: string) => p.length >= 6 },
  { label: "En az 1 rakam veya sembol", check: (p: string) => /[0-9!@#$%^&*]/.test(p) },
];

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await register(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="w-full max-w-[420px] mx-auto animate-slide-up">
      <div
        className="relative rounded-card overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, #2DC653, #4361EE, #0EA5E9)",
          }}
        />

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-text-primary mb-1.5">
              Hesap oluştur
            </h1>
            <p className="text-text-muted text-sm">
              Ücretsiz kayıt ol, KPI takibine hemen başla
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-accent-red/10 border border-accent-red/25 rounded-input px-4 py-3 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-red mt-1.5 flex-shrink-0" />
              <p className="text-sm text-accent-red">{error}</p>
            </div>
          )}

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-muted tracking-wide uppercase">
                E-posta
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                  required
                  autoComplete="email"
                  className="input-base pl-10"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-muted tracking-wide uppercase">
                Şifre
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none"
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="En az 6 karakter"
                  required
                  autoComplete="new-password"
                  className="input-base pl-10 pr-11"
                  disabled={isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-muted transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength hints */}
              {password.length > 0 && (
                <div className="flex flex-col gap-1 pt-1 animate-fade-in">
                  {passwordRules.map((rule) => (
                    <div key={rule.label} className="flex items-center gap-2">
                      <CheckCircle2
                        size={12}
                        className={
                          rule.check(password) ? "text-accent-green" : "text-text-disabled"
                        }
                      />
                      <span
                        className={`text-xs ${
                          rule.check(password) ? "text-accent-green" : "text-text-disabled"
                        }`}
                      >
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Password confirm */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-muted tracking-wide uppercase">
                Şifre Tekrar
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-disabled pointer-events-none"
                />
                <input
                  name="passwordConfirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Şifreyi tekrar girin"
                  required
                  autoComplete="new-password"
                  className="input-base pl-10 pr-11"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-muted transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary"
                style={{
                  background: isPending
                    ? undefined
                    : "linear-gradient(135deg, #4361EE 0%, #3a56e4 100%)",
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Kayıt olunuyor...
                  </>
                ) : (
                  <>
                    Kayıt Ol
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="text-xs text-text-disabled font-medium">veya</span>
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-text-muted">
            Zaten hesabın var mı?{" "}
            <Link
              href="/giris"
              className="text-accent-blue hover:text-blue-400 font-semibold transition-colors"
            >
              Giriş yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
