import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProgram, addProgram, updateProgram, loadPrograms } from '../utils/storage';
import { STATUS_LABELS } from '../utils/constants';

const EMPTY_FORM = {
    university: '',
    programName: '',
    status: 'not_started',
    deadline: '',
    website: '',
    notes: '',
};

function ProgramForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState(() => {
        if (isEditing) {
            const existing = loadPrograms().find((p) => p.id === id);
            if (existing) {
                return {
                    university: existing.university,
                    programName: existing.programName,
                    status: existing.status,
                    deadline: existing.deadline || '',
                    website: existing.website,
                    notes: existing.notes,
                };
            }
        }
        return EMPTY_FORM;
    });

    function handleChange(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (isEditing) {
            updateProgram(id, form);
        } else {
            addProgram(createProgram(form));
        }
        navigate('/');
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

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}>
                        Enregistrer
                    </button>
                    <button type="button" onClick={() => navigate('/')}>Annuler</button>
                </div>
            </form>
        </div>
    );
}

export default ProgramForm;