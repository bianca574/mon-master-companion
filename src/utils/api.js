import { getToken, logout } from './auth';

const API_BASE = 'http://localhost:3001';

async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
        logout();
        window.location.href = '/login';
        throw new Error('Session expirée');
    }

    if (res.status === 204) return null;

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
    return data;
}

export { apiFetch, API_BASE };