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

export {
  loadPrograms,
  savePrograms,
  createProgram,
  addProgram,
  updateProgram,
  deleteProgram,
  generateId,
};