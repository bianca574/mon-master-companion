import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadPrograms, loadJournalEntries, addJournalEntry, deleteJournalEntry, generateId } from '../utils/storage';

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function Journal() {
    const [programs] = useState(() => loadPrograms());
    const [entries, setEntries] = useState(() => loadJournalEntries());
    const [date, setDate] = useState(todayStr());
    const [text, setText] = useState('');
    const [programId, setProgramId] = useState('');

    const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

    function refresh() {
        setEntries(loadJournalEntries());
    }

    function handleAdd(e) {
        e.preventDefault();
        if (!text.trim()) return;
        addJournalEntry({
            id: generateId(),
            date,
            text: text.trim(),
            programId: programId || null,
            createdAt: new Date().toISOString(),
        });
        setText('');
        refresh();
    }

    function handleDelete(id) {
        deleteJournalEntry(id);
        refresh();
    }

    const inputStyle = {
        padding: '0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 650, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Journal de candidature</h1>

            <form
                onSubmit={handleAdd}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '2rem' }}
            >
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <input type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} />
                    <select style={{ ...inputStyle, flex: 1 }} value={programId} onChange={(e) => setProgramId(e.target.value)}>
                        <option value="">Aucune candidature liée</option>
                        {programs.map((p) => (
                            <option key={p.id} value={p.id}>{p.university} — {p.programName}</option>
                        ))}
                    </select>
                </div>
                <textarea
                    style={{ ...inputStyle, width: '100%', minHeight: 70, marginBottom: '1.3rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ex : Demandé une lettre de recommandation à..."
                />
                <button
                    type="submit"
                    style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}
                >
                    Ajouter au journal
                </button>
            </form>

            {sorted.length === 0 && (
                <p style={{ color: 'var(--color-text-secondary)' }}>Aucune entrée pour le moment.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {sorted.map((entry, i) => {
                    const program = programs.find((p) => p.id === entry.programId);
                    return (
                        <div key={entry.id}>
                            {i > 0 && <div style={{ borderTop: '1px dashed var(--color-border)', margin: '0.9rem 0' }} />}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                                        {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                        {program && (
                                            <>
                                                {' · '}
                                                <Link to={`/programs/${program.id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{program.programName}, {program.university}</Link>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entry.text}</div>
                                </div>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', flexShrink: 0 }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Journal;