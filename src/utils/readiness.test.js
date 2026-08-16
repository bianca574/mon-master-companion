import { describe, it, expect } from 'vitest';
import { getReadinessDetail } from './readiness';

describe('getReadinessDetail', () => {
    it('returns 0 when nothing is filled in', () => {
        const program = { id: '1', documents: [] };
        const { score, parts } = getReadinessDetail(program, [], []);
        expect(score).toBe(0);
        expect(parts).toHaveLength(3);
    });

    it('scores 100 when everything is complete', () => {
        const program = { id: '1', documents: [{ done: true }] };
        const letters = [{ programId: '1' }];
        const recommendations = [{ programIds: ['1'], status: 'received' }];
        const { score } = getReadinessDetail(program, letters, recommendations);
        expect(score).toBe(100);
    });

    it('weights documents at 50%, letter and recommendations at 25% each', () => {
        const program = { id: '1', documents: [{ done: true }, { done: false }] };
        const { score } = getReadinessDetail(program, [], []);
        // Documents: 50% weight, 50% done → 25
        // Letter: 25% weight, not drafted → 0
        // Recommendations: 25% weight, none linked → 0
        // Total: 25/100 = 25%
        expect(score).toBe(25);
    });
});