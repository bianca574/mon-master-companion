import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../utils/auth';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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
            await resetPassword(token, newPassword);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    }

    if (!token) {
        return (
            <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
                <p>Lien invalide.</p>
                <Link to="/forgot-password" style={{ color: 'var(--color-primary)' }}>Demander un nouveau lien</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 400, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Nouveau mot de passe</h1>

            {success ? (
                <p style={{ color: 'var(--color-status-ok)' }}>Mot de passe mis à jour. Redirection...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '0.3rem' }}>Nouveau mot de passe</label>
                    <input
                        type="password"
                        style={inputStyle}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                    />

                    {error && <p style={{ color: 'var(--color-status-urgent)', fontSize: '0.85rem' }}>{error}</p>}

                    <button
                        type="submit"
                        style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-pill)', padding: '0.6rem 1.2rem', fontWeight: 600, width: '100%' }}
                    >
                        Réinitialiser
                    </button>
                </form>
            )}
        </div>
    );
}

export default ResetPassword;