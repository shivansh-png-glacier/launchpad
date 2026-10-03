import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <Link href="/" className="text-sm font-semibold text-slate-500">← LaunchPad</Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">Create your account</h1>
          <p className="mt-2 text-slate-600">Start turning ideas into projects.</p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link href="/login" className="font-semibold text-slate-950">Sign in</Link></p>
      </section>
    </main>
  );
}
