"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required.").max(100),
  description: z.string().trim().max(1000).optional(),
  goal: z.string().trim().max(1000).optional(),
  deadline: z.string().optional(),
});

export async function createProject(formData: FormData) {
  const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    goal: formData.get("goal"),
    deadline: formData.get("deadline"),
  });

    if (!parsed.success) {
        throw new Error(
            parsed.error.issues[0]?.message ?? "Invalid project details.",
        );
    }

  const { name, description, goal, deadline } = parsed.data;

  await prisma.project.create({
    data: {
      name,
      description: description || null,
      goal: goal || null,
      deadline: deadline ? new Date(`${deadline}T23:59:59`) : null,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}