import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateProfile } from '../utils/auth';

function Profile({ onSuccess }) {
    const navigate = useNavigate();
    const user = getCurrentUser();
    const [name, setName] = useState(user?.name || '');
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);

    const inputStyle = {
        width: '100%',
        padding: '0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        marginBottom: '1rem',
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSaved(false);
        try {
            await updateProfile(name);
            onSuccess?.();
            setSaved(true);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Profil</h1>

            <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom</label>
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />

                <label style={{ display: 'block', marginTop: '0.5rem', marginBottom: '0.5rem' }}>Email</label>
                <input style={{ ...inputStyle, opacity: 0.6 }} value={user?.email || ''} disabled />

                {error && <p style={{ color: 'var(--color-status-urgent)', fontSize: '0.85rem' }}>{error}</p>}
                {saved && <p style={{ color: 'var(--color-status-ok)', fontSize: '0.85rem' }}>Enregistré.</p>}

                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.7rem' }}>
                    <button type="submit" style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600 }}>
                        Enregistrer
                    </button>
                    <button type="button" onClick={() => navigate('/')}>Retour</button>
                </div>
            </form>
        </div>
    );
}

export default Profile;