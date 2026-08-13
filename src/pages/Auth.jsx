import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, login } from '../utils/auth';

function Auth({ onSuccess }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
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
        try {
            if (mode === 'login') {
                await login(email, password);
            } else {
                await signup(email, password, name);
            }
            onSuccess?.();
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
            </h1>

            <form onSubmit={handleSubmit}>
                {mode === 'signup' && (
                    <>
                        <label style={{ display: 'block', marginBottom: '0.3rem' }}>Nom</label>
                        <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
                    </>
                )}
                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Email</label>
                <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label style={{ display: 'block', marginBottom: '0.3rem' }}>Mot de passe</label>
                <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />

                {error && <p style={{ color: 'var(--color-status-urgent)', fontSize: '0.85rem' }}>{error}</p>}

                <button
                    type="submit"
                    style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600, width: '100%' }}
                >
                    {mode === 'login' ? 'Se connecter' : "S'inscrire"}
                </button>
            </form>

            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
                <span
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
                >
                    {mode === 'login' ? "S'inscrire" : 'Se connecter'}
                </span>
            </p>
        </div>
    );
}

export default Auth;