import Link from "next/link";

import { IDEA_STATUS_LABELS } from "@/src/domain/idea/idea-status";
import type { IdeaDto } from "@/src/interfaces/api/idea.dto";
import { formatIdeaDate } from "@/src/lib/format";

import { RiceScoreBadge } from "./RiceScoreBadge";

type IdeaListItemProps = {
  idea: IdeaDto;
};

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function IdeaListItem({ idea }: IdeaListItemProps) {
  return (
    <li className="idea-list-item">
      <Link href={`/ideas/${idea.id}`} className="idea-list-link">
        <div className="idea-list-header">
          <h3>{idea.title}</h3>
          <div className="idea-list-badges">
            <span className={`badge badge-status badge-status-${idea.status.toLowerCase()}`}>
              {IDEA_STATUS_LABELS[idea.status]}
            </span>
            <RiceScoreBadge score={idea.riceScore} />
          </div>
        </div>
        {idea.description ? (
          <p className="idea-list-description">{truncate(idea.description, 120)}</p>
        ) : (
          <p className="idea-list-description idea-list-description-muted">
            No notes yet. Just vibes and a good title.
          </p>
        )}
        <p className="idea-list-meta">Added {formatIdeaDate(idea.createdAt, true)}</p>
      </Link>
    </li>
  );
}

