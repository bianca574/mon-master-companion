export function getReadinessDetail(program, letters, recommendations) {
  const parts = [];

  if (program.documents.length > 0) {
    const done = program.documents.filter((d) => d.done).length;
    parts.push({ label: 'Documents', weight: 50, score: done / program.documents.length });
  }

  const hasLetter = letters.some((l) => l.programId === program.id);
  parts.push({ label: 'Lettre de motivation rédigée', weight: 25, score: hasLetter ? 1 : 0 });

  const linkedRecs = recommendations.filter((r) => r.programIds.includes(program.id));
  if (linkedRecs.length > 0) {
    const confirmed = linkedRecs.filter((r) => r.status === 'received').length;
    parts.push({ label: 'Recommandations reçues', weight: 25, score: confirmed / linkedRecs.length });
  }

  const totalWeight = parts.reduce((sum, p) => sum + p.weight, 0);
  const score = totalWeight === 0
    ? 0
    : Math.round((parts.reduce((sum, p) => sum + p.weight * p.score, 0) / totalWeight) * 100);

  return { score, parts };
}

export function calculateReadiness(program, letters, recommendations) {
  return getReadinessDetail(program, letters, recommendations).score;
}