"use server";

import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(320),
  password: z.string().min(8).max(128),
});

export async function register(
  _prevState: { error: string; success: boolean },
  formData: FormData
) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) return {
    error: "Enter a valid name, email, and password of at least 8 characters.",
    success: false,
  };

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return {
    error: "An account with this email already exists.",
    success: false,
  };

  const passwordHash = await hash(parsed.data.password, 12);
  await prisma.user.create({ data: { name: parsed.data.name, email, passwordHash } });

  return { error: "", success: true };
}
