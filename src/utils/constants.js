export const STATUS_LABELS = {
    not_started: 'Non commencé',
    in_progress: 'En cours',
    submitted: 'Envoyée',
    waiting: 'En attente',
    accepted: 'Acceptée',
    rejected: 'Refusée',
};

export const STATUS_COLORS = {
    not_started: { bg: 'var(--color-border)', text: 'var(--color-text-secondary)' },
    in_progress: { bg: 'var(--color-primary)', text: '#FFFFFF' },
    submitted: { bg: 'var(--color-primary-dark)', text: '#FFFFFF' },
    waiting: { bg: 'var(--color-status-soon)', text: '#FFFFFF' },
    accepted: { bg: 'var(--color-primary-dark)', text: '#FFFFFF' },
    rejected: { bg: 'var(--color-secondary)', text: '#FFFFFF' },
};