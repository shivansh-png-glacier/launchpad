"use server";

import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const projectPlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  goal: z.string().max(1000),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().max(500),
        tasks: z
          .array(
            z.object({
              title: z.string().min(1).max(150),
              description: z.string().max(500),
              priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
            })
          )
          .min(1)
          .max(8),
      })
    )
    .min(1)
    .max(8),
});

const projectPlanResponseSchema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "A concise name for the project.",
    },
    description: {
      type: Type.STRING,
      description: "A concise description of the project.",
    },
    goal: {
      type: Type.STRING,
      description: "The main measurable goal of the project.",
    },
    milestones: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The milestone title.",
          },
          description: {
            type: Type.STRING,
            description: "A short explanation of the milestone.",
          },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "A concrete actionable task.",
                },
                description: {
                  type: Type.STRING,
                  description: "A short explanation of the task.",
                },
                priority: {
                  type: Type.STRING,
                  enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
                  description: "Task priority.",
                },
              },
              required: ["title", "description", "priority"],
            },
          },
        },
        required: ["title", "description", "tasks"],
      },
    },
  },
  required: ["name", "description", "goal", "milestones"],
};

export async function generateProject(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const idea = String(formData.get("idea") ?? "").trim();

  if (!idea) {
    throw new Error("Please describe your project idea.");
  }

  if (idea.length > 2000) {
    throw new Error("Project idea must be 2000 characters or less.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `
You are LaunchPad, an AI project manager.

Turn the user's project idea into a practical project plan.

Create:
- a clear project name
- a concise description
- a measurable project goal
- 2 to 6 milestones
- 2 to 6 actionable tasks per milestone

Tasks should be concrete and realistic for a real project.

Choose realistic priorities from:
LOW, MEDIUM, HIGH, URGENT.

User's project idea:

${idea}
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: projectPlanResponseSchema,
    },
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error("Gemini did not return a project plan.");
  }

  let plan;

  try {
    plan = projectPlanSchema.parse(JSON.parse(rawText));
  } catch {
    throw new Error("Gemini returned an invalid project plan.");
  }

  const project = await prisma.project.create({
  data: {
    name: plan.name,
    description: plan.description,
    goal: plan.goal,
    ownerId: session.user.id,
  },
});

for (const milestone of plan.milestones) {
  const createdMilestone = await prisma.milestone.create({
    data: {
      title: milestone.title,
      description: milestone.description,
      projectId: project.id,
    },
  });

  await prisma.task.createMany({
    data: milestone.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: "TODO",
      projectId: project.id,
      milestoneId: createdMilestone.id,
    })),
  });
}

redirect(`/dashboard/projects/${project.id}`);
}