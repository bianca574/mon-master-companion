import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../utils/auth';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
        setMessage('');
        try {
            const msg = await requestPasswordReset(email);
            setMessage(msg);
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Mot de passe oublié</h1>

            <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />

                {error && <p style={{ color: 'var(--color-status-urgent)', fontSize: '0.85rem' }}>{error}</p>}
                {message && <p style={{ color: 'var(--color-status-ok)', fontSize: '0.85rem' }}>{message}</p>}

                <button
                    type="submit"
                    style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600, width: '100%', marginTop: '0.5rem' }}
                >
                    Envoyer le lien
                </button>
            </form>

            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
                <Link to="/login" style={{ color: 'var(--color-primary)' }}>Retour à la connexion</Link>
            </p>
        </div>
    );
}

export default ForgotPassword;
