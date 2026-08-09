import { useState } from 'react';
import { diffWords } from 'diff';
import { loadPrograms, loadLetters } from '../utils/storage';

function LetterDiff() {
    const [programs] = useState(() => loadPrograms());
    const [letters] = useState(() => loadLetters());

    const options = letters
        .map((l) => {
            const program = programs.find((p) => p.id === l.programId);
            return {
                id: l.id,
                label: `${program?.university || '?'} — ${program?.programName || '?'} — v${l.versionNumber}`,
                content: l.content,
            };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

    const [leftId, setLeftId] = useState(options[0]?.id || '');
    const [rightId, setRightId] = useState(options[1]?.id || '');

    const left = options.find((o) => o.id === leftId);
    const right = options.find((o) => o.id === rightId);

    const diff = left && right ? diffWords(left.content, right.content) : [];

    const unchangedLength = diff
        .filter((part) => !part.added && !part.removed)
        .reduce((sum, part) => sum + part.value.length, 0);
    const totalLength = Math.max(left?.content.length || 0, right?.content.length || 0);
    const similarity = totalLength > 0 ? Math.round((unchangedLength / totalLength) * 100) : 0;

    const selectStyle = {
        width: '100%',
        padding: '0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Comparer des versions</h1>

            {options.length < 2 ? (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Il faut au moins deux versions de lettre enregistrées pour comparer.
                </p>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Version A</label>
                            <select style={selectStyle} value={leftId} onChange={(e) => setLeftId(e.target.value)}>
                                {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Version B</label>
                            <select style={selectStyle} value={rightId} onChange={(e) => setRightId(e.target.value)}>
                                {options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h3>Différences</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            Similarité : {similarity}%
                        </span>
                    </div>

                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        {diff.map((part, i) => {
                            if (part.added) {
                                return <span key={i} style={{ background: 'var(--color-status-ok)', color: '#fff', borderRadius: 4, padding: '0 2px' }}>{part.value}</span>;
                            }
                            if (part.removed) {
                                return <span key={i} style={{ background: 'var(--color-status-urgent)', color: '#fff', borderRadius: 4, padding: '0 2px', textDecoration: 'line-through' }}>{part.value}</span>;
                            }
                            return <span key={i}>{part.value}</span>;
                        })}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '1.5rem' }}>
                        <span style={{ background: 'var(--color-status-ok)', color: '#fff', borderRadius: 4, padding: '0 4px' }}>Vert</span> = présent seulement dans la version B ·{' '}
                        <span style={{ background: 'var(--color-status-urgent)', color: '#fff', borderRadius: 4, padding: '0 4px' }}>Rose</span> = présent seulement dans la version A
                    </p>
                </>
            )}
        </div>
    );
}

export default LetterDiff;