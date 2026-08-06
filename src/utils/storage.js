// Data model
//
// Program shape:
// {
//   id: string,
//   university: string,
//   programName: string,
//   status: 'not_started' | 'in_progress' | 'submitted' | 'accepted' | 'waiting' | 'rejected',
//   deadline: string | null,        // ISO date, e.g. '2027-04-15'
//   website: string,
//   documents: [
//     { id: string, label: string, done: boolean }
//   ],
//   notes: string,
//   createdAt: string,              // ISO timestamp
//   updatedAt: string,              // ISO timestamp
// }

const STORAGE_KEY = 'monmaster_programs';

function generateId() {
  return crypto.randomUUID();
}

function loadPrograms() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load programs from localStorage', err);
    return [];
  }
}

function savePrograms(programs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
    return true;
  } catch (err) {
    console.error('Failed to save programs to localStorage', err);
    return false;
  }
}

function createProgram(fields) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    university: '',
    programName: '',
    status: 'not_started',
    deadline: null,
    website: '',
    documents: [],
    scores: {},
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...fields,
  };
}

function addProgram(program) {
  const programs = loadPrograms();
  const updated = [...programs, program];
  savePrograms(updated);
  return updated;
}

function updateProgram(id, changes) {
  const programs = loadPrograms();
  const updated = programs.map((p) =>
    p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
  );
  savePrograms(updated);
  return updated;
}

function deleteProgram(id) {
  const programs = loadPrograms();
  const updated = programs.filter((p) => p.id !== id);
  savePrograms(updated);
  return updated;
}

function addDocument(programId, label) {
  const programs = loadPrograms();
  const updated = programs.map((p) =>
    p.id === programId
      ? {
          ...p,
          documents: [...p.documents, { id: generateId(), label, done: false }],
          updatedAt: new Date().toISOString(),
        }
      : p
  );
  savePrograms(updated);
  return updated;
}

function toggleDocument(programId, docId) {
  const programs = loadPrograms();
  const updated = programs.map((p) =>
    p.id === programId
      ? {
          ...p,
          documents: p.documents.map((d) =>
            d.id === docId ? { ...d, done: !d.done } : d
          ),
          updatedAt: new Date().toISOString(),
        }
      : p
  );
  savePrograms(updated);
  return updated;
}

function removeDocument(programId, docId) {
  const programs = loadPrograms();
  const updated = programs.map((p) =>
    p.id === programId
      ? {
          ...p,
          documents: p.documents.filter((d) => d.id !== docId),
          updatedAt: new Date().toISOString(),
        }
      : p
  );
  savePrograms(updated);
  return updated;
}

const RECOMMENDATION_KEY = 'monmaster_recommendations';

// Recommendation shape:
// {
//   id, name, institution,
//   status: 'not_asked' | 'asked' | 'confirmed' | 'received',
//   programIds: string[],   // linked programs, can be empty (general)
//   askedDate: string | null,
//   notes: string,
//   createdAt, updatedAt,
// }

function loadRecommendations() {
  try {
    const raw = localStorage.getItem(RECOMMENDATION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load recommendations', err);
    return [];
  }
}

function saveRecommendations(list) {
  try {
    localStorage.setItem(RECOMMENDATION_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    console.error('Failed to save recommendations', err);
    return false;
  }
}

function createRecommendation(fields) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: '',
    institution: '',
    status: 'not_asked',
    programIds: [],
    askedDate: null,
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...fields,
  };
}

function addRecommendation(rec) {
  const list = loadRecommendations();
  const updated = [...list, rec];
  saveRecommendations(updated);
  return updated;
}

function updateRecommendation(id, changes) {
  const list = loadRecommendations();
  const updated = list.map((r) =>
    r.id === id ? { ...r, ...changes, updatedAt: new Date().toISOString() } : r
  );
  saveRecommendations(updated);
  return updated;
}

function deleteRecommendation(id) {
  const list = loadRecommendations();
  const updated = list.filter((r) => r.id !== id);
  saveRecommendations(updated);
  return updated;
}

const CRITERIA_KEY = 'monmaster_criteria';

// Criterion shape: { id, name, weight }  (weight in %, e.g. 30)

function loadCriteria() {
  try {
    const raw = localStorage.getItem(CRITERIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load criteria', err);
    return [];
  }
}

function saveCriteria(list) {
  try {
    localStorage.setItem(CRITERIA_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    console.error('Failed to save criteria', err);
    return false;
  }
}

function createCriterion(fields) {
  return { id: generateId(), name: '', weight: 10, ...fields };
}

function addCriterion(criterion) {
  const list = [...loadCriteria(), criterion];
  saveCriteria(list);
  return list;
}

function updateCriterion(id, changes) {
  const list = loadCriteria().map((c) => (c.id === id ? { ...c, ...changes } : c));
  saveCriteria(list);
  return list;
}

function deleteCriterion(id) {
  const list = loadCriteria().filter((c) => c.id !== id);
  saveCriteria(list);
  return list;
}

function updateProgramScore(programId, criteriaId, score) {
  const programs = loadPrograms();
  const updated = programs.map((p) =>
    p.id === programId
      ? { ...p, scores: { ...p.scores, [criteriaId]: score }, updatedAt: new Date().toISOString() }
      : p
  );
  savePrograms(updated);
  return updated;
}
const LETTER_KEY = 'monmaster_letters';

// Letter version shape:
// { id, programId, versionNumber, content, createdAt }

function loadLetters() {
  try {
    const raw = localStorage.getItem(LETTER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load letters', err);
    return [];
  }
}

function saveLetters(list) {
  try {
    localStorage.setItem(LETTER_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    console.error('Failed to save letters', err);
    return false;
  }
}

function addLetterVersion(programId, content) {
  const all = loadLetters();
  const existingForProgram = all.filter((l) => l.programId === programId);
  const nextVersion = existingForProgram.length
    ? Math.max(...existingForProgram.map((l) => l.versionNumber)) + 1
    : 1;

  const newLetter = {
    id: generateId(),
    programId,
    versionNumber: nextVersion,
    content,
    createdAt: new Date().toISOString(),
  };

  const updated = [...all, newLetter];
  saveLetters(updated);
  return updated;
}

function deleteLetterVersion(id) {
  const updated = loadLetters().filter((l) => l.id !== id);
  saveLetters(updated);
  return updated;
}

function getLettersForProgram(programId) {
  return loadLetters()
    .filter((l) => l.programId === programId)
    .sort((a, b) => b.versionNumber - a.versionNumber);
}

const ALL_KEYS = {
  programs: 'monmaster_programs',
  recommendations: 'monmaster_recommendations',
  criteria: 'monmaster_criteria',
  letters: 'monmaster_letters',
};

function exportAllData() {
  const data = {};
  for (const [key, storageKey] of Object.entries(ALL_KEYS)) {
    const raw = localStorage.getItem(storageKey);
    data[key] = raw ? JSON.parse(raw) : [];
  }
  data.exportedAt = new Date().toISOString();
  return data;
}

function importAllData(data) {
  for (const [key, storageKey] of Object.entries(ALL_KEYS)) {
    if (Array.isArray(data[key])) {
      localStorage.setItem(storageKey, JSON.stringify(data[key]));
    }
  }
}

export {
  loadPrograms,
  savePrograms,
  createProgram,
  addProgram,
  updateProgram,
  deleteProgram,
  generateId,
  addDocument,
  toggleDocument,
  removeDocument,
  loadRecommendations,
  saveRecommendations,
  createRecommendation,
  addRecommendation,
  updateRecommendation,
  deleteRecommendation,
  loadCriteria,
  saveCriteria,
  createCriterion,
  addCriterion,
  updateCriterion,
  deleteCriterion,
  updateProgramScore,
  loadLetters,
  saveLetters,
  addLetterVersion,
  deleteLetterVersion,
  getLettersForProgram,
  exportAllData,
  importAllData
};