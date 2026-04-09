type RiceScoreBadgeProps = {
  score: number | null;
};

export function RiceScoreBadge({ score }: RiceScoreBadgeProps) {
  if (score === null) {
    return null;
  }

  return <span className="badge badge-score">RICE {score.toFixed(2)}</span>;
}

