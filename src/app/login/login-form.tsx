"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    
    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/dashboard",
      });
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <form action={submit} className="space-y-5">
      <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Email</span><input name="email" type="email" autoComplete="email" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" /></label>
      <label className="block space-y-2"><span className="text-sm font-medium text-slate-700">Password</span><input name="password" type="password" autoComplete="current-password" required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200" /></label>
      {(error || params.get("registered")) && <p className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>{error || "Account created. Sign in to continue."}</p>}
      <button disabled={pending} className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
