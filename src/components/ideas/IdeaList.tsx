import type { IdeaDto } from "@/src/interfaces/api/idea.dto";

import { EmptyState } from "./EmptyState";
import { IdeaListItem } from "./IdeaListItem";

type IdeaListProps = {
  ideas: IdeaDto[];
};

export function IdeaList({ ideas }: IdeaListProps) {
  if (ideas.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="stack-md">
      <div className="section-heading">
        <div>
          <h2>Idea lot</h2>
          <p>Newest first. No judgment, just parking spots.</p>
        </div>
        <span className="section-pill">{ideas.length} total</span>
      </div>
      <ul className="idea-list">
        {ideas.map((idea) => (
          <IdeaListItem key={idea.id} idea={idea} />
        ))}
      </ul>
    </section>
  );
}

