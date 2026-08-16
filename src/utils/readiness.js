export function getReadinessDetail(program, letters, recommendations) {
  const documentsScore = program.documents.length > 0
    ? program.documents.filter((d) => d.done).length / program.documents.length
    : 0;

  const hasLetter = letters.some((l) => l.programId === program.id);

  const linkedRecs = recommendations.filter((r) => r.programIds.includes(program.id));
  const recsScore = linkedRecs.length > 0
    ? linkedRecs.filter((r) => r.status === 'received').length / linkedRecs.length
    : 0;

  const parts = [
    { label: 'Documents', weight: 50, score: documentsScore },
    { label: 'Lettre de motivation rédigée', weight: 25, score: hasLetter ? 1 : 0 },
    { label: 'Recommandations reçues', weight: 25, score: recsScore },
  ];

  const totalWeight = parts.reduce((sum, p) => sum + p.weight, 0);
  const score = Math.round((parts.reduce((sum, p) => sum + p.weight * p.score, 0) / totalWeight) * 100);

  return { score, parts };
}

export function calculateReadiness(program, letters, recommendations) {
  return getReadinessDetail(program, letters, recommendations).score;
}