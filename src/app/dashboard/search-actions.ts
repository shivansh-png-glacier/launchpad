"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function searchWorkspace(query: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const cleanedQuery = query.trim();

  if (!cleanedQuery) {
    return {
      projects: [],
      tasks: [],
      milestones: [],
    };
  }

  const [projects, tasks, milestones] = await Promise.all([
    prisma.project.findMany({
      where: {
        ownerId: session.user.id,
        name: {
          contains: cleanedQuery,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 5,
    }),

    prisma.task.findMany({
      where: {
        project: {
          ownerId: session.user.id,
        },
        OR: [
          {
            title: {
              contains: cleanedQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: cleanedQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        projectId: true,
      },
      take: 5,
    }),

    prisma.milestone.findMany({
      where: {
        project: {
          ownerId: session.user.id,
        },
        OR: [
          {
            title: {
              contains: cleanedQuery,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: cleanedQuery,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        projectId: true,
      },
      take: 5,
    }),
  ]);

  return {
    projects,
    tasks,
    milestones,
  };
}