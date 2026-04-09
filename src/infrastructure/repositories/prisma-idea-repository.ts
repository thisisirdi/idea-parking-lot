import { Prisma, type IdeaStatus } from "@prisma/client";

import { prisma } from "@/src/infrastructure/db/prisma";
import { mapPrismaIdeaToDomain } from "@/src/infrastructure/mappers/idea.mapper";
import { NotFoundError } from "@/src/lib/errors";

import type {
  CreateIdeaRecord,
  IdeaRepository,
  UpdateIdeaRecord
} from "./idea-repository";

export class PrismaIdeaRepository implements IdeaRepository {
  async create(input: CreateIdeaRecord) {
    const idea = await prisma.idea.create({
      data: {
        ...input,
        status: input.status as IdeaStatus
      }
    });

    return mapPrismaIdeaToDomain(idea);
  }

  async update(id: string, input: UpdateIdeaRecord) {
    try {
      const idea = await prisma.idea.update({
        where: { id },
        data: input
      });

      return mapPrismaIdeaToDomain(idea);
    } catch (error) {
      if (isPrismaNotFound(error)) {
        throw new NotFoundError("Idea not found.");
      }

      throw error;
    }
  }

  async findById(id: string) {
    const idea = await prisma.idea.findUnique({
      where: { id }
    });

    return idea ? mapPrismaIdeaToDomain(idea) : null;
  }

  async listAll() {
    const ideas = await prisma.idea.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return ideas.map(mapPrismaIdeaToDomain);
  }

  async changeStatus(id: string, status: IdeaStatus) {
    try {
      const idea = await prisma.idea.update({
        where: { id },
        data: { status }
      });

      return mapPrismaIdeaToDomain(idea);
    } catch (error) {
      if (isPrismaNotFound(error)) {
        throw new NotFoundError("Idea not found.");
      }

      throw error;
    }
  }
}

function isPrismaNotFound(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}
