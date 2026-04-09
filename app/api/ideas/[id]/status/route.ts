import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ChangeIdeaStatusService } from "@/src/application/ideas/change-idea-status.service";
import { PrismaIdeaRepository } from "@/src/infrastructure/repositories/prisma-idea-repository";
import { toIdeaDto } from "@/src/interfaces/api/idea.dto";
import { fromError, ok } from "@/src/interfaces/api/responses";
import { changeIdeaStatusSchema, ideaIdParamSchema } from "@/src/interfaces/api/validators";
import { ValidationError } from "@/src/lib/errors";

export const runtime = "nodejs";

const repository = new PrismaIdeaRepository();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const params = ideaIdParamSchema.parse(await context.params);
    const input = changeIdeaStatusSchema.parse(await request.json());
    const service = new ChangeIdeaStatusService(repository);
    const idea = await service.execute(params.id, input.status);

    return ok(toIdeaDto(idea));
  } catch (error) {
    if (error instanceof SyntaxError) {
      return fromError(new ValidationError("Request body must be valid JSON."));
    }

    if (error instanceof ZodError) {
      return fromError(new ValidationError(error.issues[0]?.message ?? "Invalid request."));
    }

    return fromError(error);
  }
}
