"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { register } from "./actions";

const initialState = { error: "", success: false };

export function RegisterForm() {
  const [state, action, pending] = useActionState(register, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) router.push("/login?registered=1");
  }, [state.success, router]);

  return (
    <form action={action} className="space-y-5">
      <Field name="name" label="Name" type="text" autoComplete="name" />
      <Field name="email" label="Email" type="email" autoComplete="email" />
      <Field name="password" label="Password" type="password" autoComplete="new-password" />
      {state.error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
        {pending ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}

function Field({ name, label, type, autoComplete }: { name: string; label: string; type: string; autoComplete: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
    </label>
  );
}
