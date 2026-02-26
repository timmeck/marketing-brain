/**
 * Wilson Score Interval — lower bound for confidence scoring.
 * Used to evaluate rule confidence based on trigger/success counts.
 */
export function wilsonScore(successes: number, total: number, z: number = 1.96): number {
  if (total === 0) return 0;

  const p = successes / total;
  const denominator = 1 + z * z / total;
  const centre = p + z * z / (2 * total);
  const offset = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total);

  return (centre - offset) / denominator;
}

/**
 * Compute engagement score from raw metrics.
 * Weights: shares > comments > clicks > likes > impressions
 */
export function engagementScore(metrics: {
  likes?: number;
  comments?: number;
  shares?: number;
  impressions?: number;
  clicks?: number;
  saves?: number;
}): number {
  return (
    (metrics.likes ?? 0) * 1 +
    (metrics.comments ?? 0) * 3 +
    (metrics.shares ?? 0) * 5 +
    (metrics.clicks ?? 0) * 2 +
    (metrics.saves ?? 0) * 4 +
    (metrics.impressions ?? 0) * 0.01
  );
}
