import Link from "next/link";
import { notFound } from "next/navigation";

import { GetIdeaService } from "@/src/application/ideas/get-idea.service";
import { IdeaDetailCard } from "@/src/components/ideas/IdeaDetailCard";
import { PrismaIdeaRepository } from "@/src/infrastructure/repositories/prisma-idea-repository";
import { toIdeaDto } from "@/src/interfaces/api/idea.dto";
import { NotFoundError } from "@/src/lib/errors";

export const dynamic = "force-dynamic";

type IdeaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params;
  const repository = new PrismaIdeaRepository();
  const getIdeaService = new GetIdeaService(repository);

  try {
    const idea = await getIdeaService.execute(id);

    return (
      <main className="shell shell-detail">
        <div className="page-back-link">
          <Link href="/">Back to the lot</Link>
        </div>
        <IdeaDetailCard initialIdea={toIdeaDto(idea)} />
      </main>
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }

    throw error;
  }
}

