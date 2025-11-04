"use client";

import { FormEvent, useState } from "react";

import { useAdminSession } from "@/components/admin/admin-session-provider";
import { Button } from "@/components/ui/button";

export function AdminLogin() {
  const { login, status, error } = useAdminSession();
  const [email, setEmail] = useState("admin@arcade.himafi.id");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(undefined);

    const result = await login({ email, password });
    setMessage(result.message);
    setSubmitting(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-background p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Masuk Dashboard ARCADE</h1>
          <p className="text-sm text-muted-foreground">
            Kelola konten INFOPROF, CeritaKita, dan material ARCADE lainnya melalui panel terpusat.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground/90">Email</span>
            <input
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@arcade.himafi.id"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground/90">Kata Sandi</span>
            <input
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi admin"
              required
            />
          </label>
          <Button type="submit" className="w-full" disabled={submitting || status === "loading"}>
            {submitting || status === "loading" ? "Memproses..." : "Masuk"}
          </Button>
        </form>
        <div className="mt-4 space-y-2 text-center text-xs text-muted-foreground">
          {message && <p>{message}</p>}
          {error && !message && <p>{error}</p>}
          {!message && !error && status === "loading" && <p>Memverifikasi sesi admin...</p>}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Pastikan variabel lingkungan Supabase (<code>SUPABASE_URL</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, dan <code>SUPABASE_ANON_KEY</code>) sudah terpasang di Vercel.
        </p>
      </div>
    </div>
  );
}
