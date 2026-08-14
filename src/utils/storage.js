import { apiFetch } from './api';

// Programs
function loadPrograms() {
  return apiFetch('/programs');
}

function loadProgram(id) {
  return apiFetch(`/programs/${id}`);
}

function createProgram(fields) {
  return apiFetch('/programs', { method: 'POST', body: JSON.stringify(fields) });
}

function updateProgram(id, changes) {
  return apiFetch(`/programs/${id}`, { method: 'PUT', body: JSON.stringify(changes) });
}

function deleteProgram(id) {
  return apiFetch(`/programs/${id}`, { method: 'DELETE' });
}

function addDocument(programId, label) {
  return apiFetch(`/programs/${programId}/documents`, { method: 'POST', body: JSON.stringify({ label }) });
}

function toggleDocument(programId, docId) {
  return apiFetch(`/programs/${programId}/documents/${docId}`, { method: 'PATCH' });
}

function removeDocument(programId, docId) {
  return apiFetch(`/programs/${programId}/documents/${docId}`, { method: 'DELETE' });
}

function updateProgramScore(programId, criteriaId, score) {
  return apiFetch(`/programs/${programId}/scores`, { method: 'PATCH', body: JSON.stringify({ criteriaId, score }) });
}

// Recommendations
function loadRecommendations() {
  return apiFetch('/recommendations');
}

function createRecommendation(fields) {
  return apiFetch('/recommendations', { method: 'POST', body: JSON.stringify(fields) });
}

function updateRecommendation(id, changes) {
  return apiFetch(`/recommendations/${id}`, { method: 'PUT', body: JSON.stringify(changes) });
}

function deleteRecommendation(id) {
  return apiFetch(`/recommendations/${id}`, { method: 'DELETE' });
}

// Criteria
function loadCriteria() {
  return apiFetch('/criteria');
}

function createCriterion(fields) {
  return apiFetch('/criteria', { method: 'POST', body: JSON.stringify(fields) });
}

function updateCriterion(id, changes) {
  return apiFetch(`/criteria/${id}`, { method: 'PUT', body: JSON.stringify(changes) });
}

function deleteCriterion(id) {
  return apiFetch(`/criteria/${id}`, { method: 'DELETE' });
}

// Letters
function loadLetters() {
  return apiFetch('/letters');
}

function getLettersForProgram(programId) {
  return loadLetters().then((letters) =>
    letters.filter((l) => l.programId === programId).sort((a, b) => b.versionNumber - a.versionNumber)
  );
}

function addLetterVersion(programId, content) {
  return apiFetch('/letters', { method: 'POST', body: JSON.stringify({ programId, content }) });
}

function deleteLetterVersion(id) {
  return apiFetch(`/letters/${id}`, { method: 'DELETE' });
}

// Journal
function loadJournalEntries() {
  return apiFetch('/journal');
}

function addJournalEntry(entry) {
  return apiFetch('/journal', { method: 'POST', body: JSON.stringify(entry) });
}

function deleteJournalEntry(id) {
  return apiFetch(`/journal/${id}`, { method: 'DELETE' });
}

// Export/import — now export reads live from the API; import is dropped 
async function exportAllData() {
  const [programs, recommendations, criteria, letters, journal] = await Promise.all([
    loadPrograms(),
    loadRecommendations(),
    loadCriteria(),
    loadLetters(),
    loadJournalEntries(),
  ]);
  return { programs, recommendations, criteria, letters, journal, exportedAt: new Date().toISOString() };
}

export {
  loadPrograms, loadProgram, createProgram, updateProgram, deleteProgram,
  addDocument, toggleDocument, removeDocument, updateProgramScore,
  loadRecommendations, createRecommendation, updateRecommendation, deleteRecommendation,
  loadCriteria, createCriterion, updateCriterion, deleteCriterion,
  loadLetters, getLettersForProgram, addLetterVersion, deleteLetterVersion,
  loadJournalEntries, addJournalEntry, deleteJournalEntry,
  exportAllData,
};