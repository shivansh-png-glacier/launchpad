import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8"><Link href="/" className="text-sm font-semibold text-slate-500">← LaunchPad</Link><h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h1><p className="mt-2 text-slate-600">Sign in to your workspace.</p></div>
        <Suspense fallback={<div className="h-48 rounded-xl bg-slate-50" />}><LoginForm /></Suspense>
        <p className="mt-6 text-center text-sm text-slate-600">New to LaunchPad? <Link href="/register" className="font-semibold text-slate-950">Create an account</Link></p>
      </section>
    </main>
  );
}
