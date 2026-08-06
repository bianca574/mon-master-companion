import { Link } from 'react-router-dom';
import { loadPrograms } from '../utils/storage';

function daysUntil(deadline) {
    const diff = new Date(deadline) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function urgencyColor(days) {
    if (days < 0) return { bg: 'var(--color-border)', text: 'var(--color-text-secondary)' };
    if (days <= 7) return { bg: 'var(--color-status-urgent)', text: '#fff' };
    if (days <= 30) return { bg: 'var(--color-status-soon)', text: '#fff' };
    return { bg: 'var(--color-status-ok)', text: '#fff' };
}

function Dashboard() {
    const programs = loadPrograms();

    const total = programs.length;
    const submitted = programs.filter((p) => p.status === 'submitted' || p.status === 'accepted' || p.status === 'waiting').length;
    const inProgress = programs.filter((p) => p.status === 'in_progress').length;

    const now = new Date();
    const deadlinesThisMonth = programs.filter((p) => {
        if (!p.deadline) return false;
        const d = new Date(p.deadline);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const upcoming = programs
        .filter((p) => p.deadline)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const statCard = (label, value) => (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', flex: 1 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{value}</div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Tableau de bord</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {statCard('Total', total)}
                {statCard('Envoyées', submitted)}
                {statCard('En cours', inProgress)}
                {statCard('Échéances ce mois-ci', deadlinesThisMonth)}
            </div>

            <h3 style={{ marginBottom: '0.75rem' }}>Prochaines échéances</h3>

            {upcoming.length === 0 && (
                <p style={{ color: 'var(--color-text-secondary)' }}>Aucune échéance renseignée.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {upcoming.map((p) => {
                    const days = daysUntil(p.deadline);
                    const color = urgencyColor(days);
                    return (
                        <Link
                            key={p.id}
                            to={`/programs/${p.id}`}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '0.75rem 1rem',
                                textDecoration: 'none',
                                color: 'var(--color-text)',
                            }}
                        >
                            <div>
                                <div style={{ fontWeight: 600 }}>{p.programName}, {p.university}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                    {new Date(p.deadline).toLocaleDateString('fr-FR')}
                                </div>
                            </div>
                            <span
                                style={{
                                    background: color.bg,
                                    color: color.text,
                                    borderRadius: 'var(--radius-pill)',
                                    padding: '0.3rem 0.75rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {days < 0 ? 'Passée' : `${days} j`}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Dashboard;