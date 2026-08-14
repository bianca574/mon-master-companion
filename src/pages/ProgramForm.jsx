import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProgram, updateProgram, loadProgram } from '../utils/storage';
import { STATUS_LABELS, PREDEFINED_TAGS } from '../utils/constants';

const EMPTY_FORM = {
    university: '',
    programName: '',
    status: 'not_started',
    deadline: '',
    website: '',
    notes: '',
    tags: [],
};

function ProgramForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY_FORM);
    const [customTagInput, setCustomTagInput] = useState('');
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            loadProgram(id).then((existing) => {
                setForm({
                    university: existing.university,
                    programName: existing.programName,
                    status: existing.status,
                    deadline: existing.deadline || '',
                    website: existing.website,
                    notes: existing.notes,
                    tags: existing.tags || [],
                });
                setLoading(false);
            });
        }
    }, [id, isEditing]);

    function handleChange(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function togglePredefinedTag(tag) {
        setForm((f) => ({
            ...f,
            tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
        }));
    }

    function addCustomTag(tag) {
        const trimmed = tag.trim();
        if (!trimmed || form.tags.includes(trimmed)) return;
        setForm((f) => ({ ...f, tags: [...f.tags, trimmed] }));
    }

    function removeTag(tag) {
        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            await updateProgram(id, form);
        } else {
            await createProgram(form);
        }
        navigate('/programs');
    }

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
    }

    const inputStyle = {
        width: '100%',
        padding: '0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        marginBottom: '1rem',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                {isEditing ? 'Modifier la candidature' : 'Nouvelle candidature'}
            </h1>

            <form onSubmit={handleSubmit}>
                <label>Université</label>
                <input style={inputStyle} value={form.university} onChange={(e) => handleChange('university', e.target.value)} required />

                <label>Nom du master</label>
                <input style={inputStyle} value={form.programName} onChange={(e) => handleChange('programName', e.target.value)} required />

                <label>Statut</label>
                <select style={inputStyle} value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>

                <label>Date limite</label>
                <input type="date" style={inputStyle} value={form.deadline} onChange={(e) => handleChange('deadline', e.target.value)} />

                <label>Site web</label>
                <input style={inputStyle} value={form.website} onChange={(e) => handleChange('website', e.target.value)} />

                <label>Notes</label>
                <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} />

                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {PREDEFINED_TAGS.map((tag) => {
                        const active = form.tags.includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => togglePredefinedTag(tag)}
                                style={{
                                    background: active ? 'var(--color-primary)' : 'var(--color-surface)',
                                    color: active ? '#fff' : 'var(--color-text)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-pill)',
                                    padding: '0.3rem 0.7rem',
                                    fontSize: '0.85rem',
                                }}
                            >
                                {tag}
                            </button>
                        );
                    })}
                </div>

                {form.tags.filter((t) => !PREDEFINED_TAGS.includes(t)).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        {form.tags.filter((t) => !PREDEFINED_TAGS.includes(t)).map((tag) => (
                            <span
                                key={tag}
                                style={{ background: 'var(--color-secondary)', color: '#fff', borderRadius: 'var(--radius-pill)', padding: '0.3rem 0.7rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                                {tag}
                                <span onClick={() => removeTag(tag)} style={{ cursor: 'pointer' }}>✕</span>
                            </span>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                        style={inputStyle}
                        value={customTagInput}
                        onChange={(e) => setCustomTagInput(e.target.value)}
                        placeholder="Ajouter un tag personnalisé..."
                    />
                    <button
                        type="button"
                        onClick={() => { addCustomTag(customTagInput); setCustomTagInput(''); }}
                    >
                        + Ajouter
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}>
                        Enregistrer
                    </button>
                    <button type="button" onClick={() => navigate('/programs')}>Annuler</button>
                </div>
            </form>
        </div>
    );
}

export default ProgramForm;