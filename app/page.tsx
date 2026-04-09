import { ListIdeasService } from "@/src/application/ideas/list-ideas.service";
import { CaptureIdeaForm } from "@/src/components/ideas/CaptureIdeaForm";
import { IdeaList } from "@/src/components/ideas/IdeaList";
import { PrismaIdeaRepository } from "@/src/infrastructure/repositories/prisma-idea-repository";
import { toIdeaDto } from "@/src/interfaces/api/idea.dto";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const repository = new PrismaIdeaRepository();
  const listIdeasService = new ListIdeasService(repository);
  const ideas = await listIdeasService.execute();

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy stack-sm">
          <p className="eyebrow">Idea Parking Lot</p>
          <h1>Got a wild idea? Park it here.</h1>
          <p className="hero-subcopy">
            Future you will thank you. Inbox: where ideas chill before they grow up.
          </p>
        </div>
      </section>

      <section className="content-grid">
        <CaptureIdeaForm />
        <IdeaList ideas={ideas.map(toIdeaDto)} />
      </section>
    </main>
  );
}

