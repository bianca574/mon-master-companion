import { API_BASE } from './api';

const TOKEN_KEY = 'monmaster_token';
const USER_KEY = 'monmaster_user';

async function signup(email, password, name) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Échec de l'inscription");
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
}

async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Échec de la connexion');
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
}

async function updateProfile(name) {
    const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Échec de la mise à jour');
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
}

async function requestPasswordReset(email) {
    const res = await fetch(`${API_BASE}/auth/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
    return data.message;
}

async function resetPassword(token, newPassword) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');
    return data.message;
}

export { signup, login, logout, getToken, getCurrentUser, updateProfile };