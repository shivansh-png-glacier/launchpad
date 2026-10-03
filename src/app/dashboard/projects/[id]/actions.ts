"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

async function logActivity(
  projectId: string,
  userId: string,
  type: string,
  description: string
) {
  await prisma.activity.create({
    data: {
      projectId,
      userId,
      type,
      description,
    },
  });
}

export async function createTask(projectId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    select: { id: true },
  });

  if (!project) throw new Error("Project not found");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "MEDIUM");

  if (!title) throw new Error("Task title is required");

  const allowed = ["LOW", "MEDIUM", "HIGH", "URGENT"];

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      projectId: project.id,
      priority: allowed.includes(priority)
        ? (priority as "LOW" | "MEDIUM" | "HIGH" | "URGENT")
        : "MEDIUM",
      status: "TODO",
    },
  });

  await logActivity(
    projectId,
    session.user.id,
    "TASK_CREATED",
    `Created task "${title}"`
  );

  revalidatePath(`/dashboard/projects/${projectId}`);
}

export async function updateTaskStatus(
  taskId: string,
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"
) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId: session.user.id,
      },
    },
    select: {
      id: true,
      projectId: true,
    },
  });

  if (!task) throw new Error("Task not found");

  await prisma.task.update({
    where: {
      id: task.id,
    },
    data: {
      status,
    },
  });

  await logActivity(
    task.projectId,
    session.user.id,
    "TASK_STATUS_UPDATED",
    `Updated a task to ${status}`
  );

  revalidatePath(`/dashboard/projects/${task.projectId}`);
}

export async function deleteTask(taskId: string) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: {
        ownerId: session.user.id,
      },
    },
    select: {
      id: true,
      projectId: true,
    },
  });

  if (!task) throw new Error("Task not found");

  await prisma.task.delete({
    where: {
      id: task.id,
    },
  });

  await logActivity(
    task.projectId,
    session.user.id,
    "TASK_DELETED",
    "Deleted a task"
  );

  revalidatePath(`/dashboard/projects/${task.projectId}`);
}

export async function createMilestone(
  projectId: string,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    select: { id: true },
  });

  if (!project) throw new Error("Project not found");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) throw new Error("Milestone title is required");

  await prisma.milestone.create({
    data: {
      title,
      description: description || null,
      projectId: project.id,
    },
  });

  await logActivity(
    projectId,
    session.user.id,
    "MILESTONE_CREATED",
    `Created milestone "${title}"`
  );

  revalidatePath(`/dashboard/projects/${projectId}`);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askProjectAssistant(
  projectId: string,
  question: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("You must be logged in.");
  }

  const cleanedQuestion = question.trim();

  if (!cleanedQuestion) {
    throw new Error("Please enter a question.");
  }

  if (cleanedQuestion.length > 1000) {
    throw new Error("Question must be 1000 characters or less.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: session.user.id,
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          title: true,
          description: true,
          status: true,
          priority: true,
        },
      },
      milestones: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          title: true,
          description: true,
        },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  const projectContext = JSON.stringify({
    project: {
      name: project.name,
      description: project.description,
      goal: project.goal,
      deadline: project.deadline,
    },
    milestones: project.milestones,
    tasks: project.tasks,
  });

    async function generateAnswer(model: string) {
    return ai.models.generateContent({
      model,
      contents: `
You are LaunchPad's AI project assistant.

Answer the user's question using ONLY the project information provided below.

Be practical, concise, and specific.

If the user asks what to work on next:
- Prefer unfinished tasks.
- Consider priority.
- Consider the current status.
- Do not recommend tasks that are already DONE.

If the user asks for a summary:
- Summarize the actual project.
- Mention the project goal.
- Mention the milestones.
- Mention meaningful progress.
- Mention important unfinished work.

If the user asks about blockers:
- Identify tasks in progress, review, or high/urgent priority that may need attention.
- Do not invent blockers that are not supported by the project data.

Never invent tasks, milestones, deadlines, or project details.

PROJECT DATA:
${projectContext}

USER QUESTION:
${cleanedQuestion}
`,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
        maxOutputTokens: 1200,
      },
    });
  }

  async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let response;

  try {
    response = await generateAnswer("gemini-3.8-flash");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (!message.includes("503") && !message.includes("UNAVAILABLE")) {
      throw error;
    }

    await sleep(1500);

    try {
      response = await generateAnswer("gemini-3.8-flash");
    } catch (secondError) {
      const secondMessage =
        secondError instanceof Error
          ? secondError.message
          : String(secondError);

      if (
        !secondMessage.includes("503") &&
        !secondMessage.includes("UNAVAILABLE")
      ) {
        throw secondError;
      }

      await sleep(3000);

      response = await generateAnswer("gemini-3.7-flash");
    }
  }

  const answer = response.text?.trim();

  if (!answer) {
    throw new Error("Gemini did not return an answer.");
  }

  return answer;
}