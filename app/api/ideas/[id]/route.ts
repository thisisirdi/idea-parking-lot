import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { GetIdeaService } from "@/src/application/ideas/get-idea.service";
import { UpdateIdeaService } from "@/src/application/ideas/update-idea.service";
import { PrismaIdeaRepository } from "@/src/infrastructure/repositories/prisma-idea-repository";
import { toIdeaDto } from "@/src/interfaces/api/idea.dto";
import { fromError, ok } from "@/src/interfaces/api/responses";
import { ideaIdParamSchema, updateIdeaSchema } from "@/src/interfaces/api/validators";
import { ValidationError } from "@/src/lib/errors";

export const runtime = "nodejs";

const repository = new PrismaIdeaRepository();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = ideaIdParamSchema.parse(await context.params);
    const service = new GetIdeaService(repository);
    const idea = await service.execute(params.id);

    return ok(toIdeaDto(idea));
  } catch (error) {
    if (error instanceof ZodError) {
      return fromError(new ValidationError(error.issues[0]?.message ?? "Invalid idea id."));
    }

    return fromError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const params = ideaIdParamSchema.parse(await context.params);
    const input = updateIdeaSchema.parse(await request.json());
    const service = new UpdateIdeaService(repository);
    const idea = await service.execute(params.id, input);

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
