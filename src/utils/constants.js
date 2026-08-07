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

export const REC_STATUS_LABELS = {
    not_asked: 'Pas encore demandé',
    asked: 'Demandé',
    confirmed: 'Confirmé',
    received: 'Reçue',
};
  
  export const REC_STATUS_COLORS = {
    not_asked: { bg: 'var(--color-border)', text: 'var(--color-text-secondary)' },
    asked: { bg: 'var(--color-status-soon)', text: '#fff' },
    confirmed: { bg: 'var(--color-primary)', text: '#fff' },
    received: { bg: 'var(--color-primary-dark)', text: '#fff' },
};

export const PREDEFINED_TAGS = [
    '🎓 Formation continue',
    '🎓 Formation initiale',
    '🏢 Alternance - Apprentissage',
    '🔬 Recherche',
    '💻 Génie logiciel',
    '🤖 IA',
    '🌐 Réseaux',
    '📊 Data Science',
    '🔐 Cybersécurité',
    '☁️ Cloud',
    '📍 Paris',
    '📍 Hors Paris',
    '⭐ Dream School',
    '🦺 Safety',
    '✅ Applied',
  ];