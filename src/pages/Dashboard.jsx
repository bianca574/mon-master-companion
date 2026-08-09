import { Link } from 'react-router-dom';
import { loadPrograms, loadLetters, loadRecommendations } from '../utils/storage';
import { STATUS_LABELS } from '../utils/constants';
import { calculateReadiness } from '../utils/readiness';

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
    const letters = loadLetters();
    const recommendations = loadRecommendations();
    const now = new Date();

    const activePrograms = programs.filter((p) => p.status !== 'accepted' && p.status !== 'rejected');

    const total = programs.length;

    const deadlinesThisWeek = programs.filter((p) => p.deadline && daysUntil(p.deadline) >= 0 && daysUntil(p.deadline) <= 7).length;
    const deadlinesThisMonth = programs.filter((p) => {
        if (!p.deadline) return false;
        const d = new Date(p.deadline);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const readinessByProgram = {};
    activePrograms.forEach((p) => {
        readinessByProgram[p.id] = calculateReadiness(p, letters, recommendations);
    });

    const overallProgress = activePrograms.length > 0
        ? Math.round(activePrograms.reduce((sum, p) => sum + readinessByProgram[p.id], 0) / activePrograms.length)
        : 0;

    const statusCounts = {};
    Object.keys(STATUS_LABELS).forEach((key) => {
        statusCounts[key] = programs.filter((p) => p.status === key).length;
    });

    const missingDocsMap = {};
    activePrograms.forEach((p) => {
        p.documents.filter((d) => !d.done).forEach((d) => {
            missingDocsMap[d.label] = (missingDocsMap[d.label] || 0) + 1;
        });
    });
    const missingDocs = Object.entries(missingDocsMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const atRisk = activePrograms.filter((p) => {
        if (!p.deadline) return false;
        const days = daysUntil(p.deadline);
        return days >= 0 && days <= 14 && readinessByProgram[p.id] < 30;
    });

    const nextTask = activePrograms
        .filter((p) => p.deadline && p.documents.some((d) => !d.done))
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
    const nextTaskDoc = nextTask?.documents.find((d) => !d.done);

    const upcoming = programs.filter((p) => p.deadline).sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const statCard = (label, value) => (
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', flex: 1, minWidth: 130 }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{value}</div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Tableau de bord</h1>

            {nextTask && (
                <div style={{ background: 'var(--color-secondary)', color: '#fff', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.85, marginBottom: '0.5rem' }}>À faire ensuite</div>
                    <Link to={`/programs/${nextTask.id}`} style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', textDecoration: 'none' }}>
                        {nextTask.programName}, {nextTask.university} — {nextTaskDoc.label}
                    </Link>
                    <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>
                        Échéance dans {daysUntil(nextTask.deadline)} j
                    </div>
                </div>
            )}

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>Progression globale</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{overallProgress}%</span>
                </div>
                <div style={{ background: 'var(--color-border)', borderRadius: 'var(--radius-pill)', height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${overallProgress}%`, height: '100%', background: 'var(--color-primary)' }} />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {statCard('Total', total)}
                {statCard('Échéances cette semaine', deadlinesThisWeek)}
                {statCard('Échéances ce mois-ci', deadlinesThisMonth)}
            </div>

            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>Candidatures par statut</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                            <span style={{ fontWeight: 600 }}>{statusCounts[key]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {missingDocs.length > 0 && (
                <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.75rem' }}>Documents manquants les plus fréquents</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {missingDocs.map(([label, count]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                                <span style={{ fontWeight: 600 }}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {atRisk.length > 0 && (
                <div style={{ background: 'var(--color-surface)', border: '2px solid var(--color-status-urgent)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-status-urgent)' }}>À risque</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {atRisk.map((p) => (
                            <Link key={p.id} to={`/programs/${p.id}`} style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.9rem' }}>
                                {p.programName}, {p.university} — {readinessByProgram[p.id]}% prêt, échéance dans {daysUntil(p.deadline)} j
                            </Link>
                        ))}
                    </div>
                </div>
            )}

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