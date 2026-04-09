import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { CreateIdeaService } from "@/src/application/ideas/create-idea.service";
import { ListIdeasService } from "@/src/application/ideas/list-ideas.service";
import { PrismaIdeaRepository } from "@/src/infrastructure/repositories/prisma-idea-repository";
import { toIdeaDto } from "@/src/interfaces/api/idea.dto";
import { created, fromError, ok } from "@/src/interfaces/api/responses";
import { createIdeaSchema } from "@/src/interfaces/api/validators";
import { ValidationError } from "@/src/lib/errors";

export const runtime = "nodejs";

const repository = new PrismaIdeaRepository();

export async function GET() {
  try {
    const service = new ListIdeasService(repository);
    const ideas = await service.execute();

    return ok(ideas.map(toIdeaDto));
  } catch (error) {
    return fromError(error);
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const input = createIdeaSchema.parse(json);
    const service = new CreateIdeaService(repository);
    const idea = await service.execute(input);

    return created(toIdeaDto(idea));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return fromError(new ValidationError("Request body must be valid JSON."));
    }

    if (error instanceof ZodError) {
      return fromError(new ValidationError(error.issues[0]?.message ?? "Invalid request body."));
    }

    return fromError(error);
  }
}
