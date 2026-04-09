import { PrismaClient } from "@prisma/client";

import { IdeaStatus } from "../src/domain/idea/idea-status";
import { calculateRiceScore } from "../src/domain/idea/rice";

const prisma = new PrismaClient();

type SeedIdea = {
  title: string;
  description: string | null;
  status: IdeaStatus;
  riceReach?: number | null;
  riceImpact?: number | null;
  riceConfidence?: number | null;
  riceEffort?: number | null;
  createdAt: Date;
};

const seedIdeas: SeedIdea[] = [
  {
    title: "Telegram bot for contract reminders",
    description: "Ping me before vendor renewals quietly turn into expensive surprises.",
    status: "INBOX",
    riceReach: 18,
    riceImpact: 2.5,
    riceConfidence: 80,
    riceEffort: 3,
    createdAt: new Date("2026-04-09T08:15:00.000Z")
  },
  {
    title: "Visual CData onboarding hub",
    description: "A single place for walkthroughs, sample queries, and first-week wins.",
    status: "EXPLORING",
    riceReach: 30,
    riceImpact: 3,
    riceConfidence: 70,
    riceEffort: 5,
    createdAt: new Date("2026-04-08T15:45:00.000Z")
  },
  {
    title: "Mini CRM for WhatsApp follow-ups",
    description: "Tiny pipeline for leads that start in chat and vanish in tab chaos.",
    status: "IN_PROGRESS",
    riceReach: 24,
    riceImpact: 3.5,
    riceConfidence: 75,
    riceEffort: 4,
    createdAt: new Date("2026-04-07T11:20:00.000Z")
  },
  {
    title: "Freelance opportunity evaluator",
    description: "Score leads by margin, fit, urgency, and weirdness before saying yes.",
    status: "PARKED",
    riceReach: 10,
    riceImpact: 2,
    riceConfidence: 65,
    riceEffort: 2,
    createdAt: new Date("2026-04-06T18:00:00.000Z")
  },
  {
    title: "Idea journaling voice inbox",
    description: "Voice notes in, transcripts later, zero friction while walking.",
    status: "EXPLORING",
    createdAt: new Date("2026-04-05T07:40:00.000Z")
  },
  {
    title: "Personal release notes generator",
    description: "Auto-summarize shipped work so weekly reviews stop being archaeology.",
    status: "SHIPPED",
    riceReach: 12,
    riceImpact: 2.5,
    riceConfidence: 90,
    riceEffort: 2,
    createdAt: new Date("2026-04-04T13:30:00.000Z")
  },
  {
    title: "Client health radar",
    description: "A simple dashboard that flags quiet accounts before they churn.",
    status: "ARCHIVED",
    riceReach: 14,
    riceImpact: 3,
    riceConfidence: 55,
    riceEffort: 6,
    createdAt: new Date("2026-04-03T16:10:00.000Z")
  },
  {
    title: "Micro landing page lab",
    description: "Spin up tiny experiments for offers without rebuilding the same page each time.",
    status: "INBOX",
    createdAt: new Date("2026-04-02T09:05:00.000Z")
  },
  {
    title: "Niche partnership tracker",
    description: "Track introductions, warm leads, and next moves with less spreadsheet fog.",
    status: "PARKED",
    riceReach: 8,
    riceImpact: 2,
    riceConfidence: 60,
    riceEffort: 1.5,
    createdAt: new Date("2026-04-01T12:55:00.000Z")
  },
  {
    title: "Tiny ops cookbook",
    description: "Short internal notes for repeated admin moves that should not require memory heroics.",
    status: "ARCHIVED",
    createdAt: new Date("2026-03-31T10:25:00.000Z")
  }
];

async function main() {
  await prisma.idea.deleteMany();

  for (const idea of seedIdeas) {
    const riceScore = calculateRiceScore({
      reach: idea.riceReach,
      impact: idea.riceImpact,
      confidence: idea.riceConfidence,
      effort: idea.riceEffort
    });

    await prisma.idea.create({
      data: {
        title: idea.title,
        description: idea.description,
        status: idea.status,
        riceReach: idea.riceReach ?? null,
        riceImpact: idea.riceImpact ?? null,
        riceConfidence: idea.riceConfidence ?? null,
        riceEffort: idea.riceEffort ?? null,
        riceScore,
        createdAt: idea.createdAt
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Failed to seed ideas", error);
    await prisma.$disconnect();
    process.exit(1);
  });
