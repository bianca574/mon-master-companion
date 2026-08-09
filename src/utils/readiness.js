export function calculateReadiness(program, letters, recommendations) {
    const components = [];
  
    if (program.documents.length > 0) {
      const done = program.documents.filter((d) => d.done).length;
      components.push({ weight: 50, score: done / program.documents.length });
    }
  
    const hasLetter = letters.some((l) => l.programId === program.id);
    components.push({ weight: 25, score: hasLetter ? 1 : 0 });
  
    const linkedRecs = recommendations.filter((r) => r.programIds.includes(program.id));
    if (linkedRecs.length > 0) {
      const confirmed = linkedRecs.filter((r) => r.status === 'received').length;
      components.push({ weight: 25, score: confirmed / linkedRecs.length });
    }
  
    const totalWeight = components.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight === 0) return 0;
  
    const weighted = components.reduce((sum, c) => sum + c.weight * c.score, 0) / totalWeight;
    return Math.round(weighted * 100);
}