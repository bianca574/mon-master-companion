import { describe, it, expect, beforeEach } from 'vitest';
import { createProgram, addProgram, loadPrograms, updateProgram, deleteProgram } from './storage';

beforeEach(() => {
  localStorage.clear();
});

describe('createProgram', () => {
  it('applies default values', () => {
    const program = createProgram({ university: 'Paris Cité', programName: 'LP' });
    expect(program.status).toBe('not_started');
    expect(program.documents).toEqual([]);
    expect(program.id).toBeTruthy();
  });
});

describe('addProgram / loadPrograms', () => {
  it('persists a program to localStorage', () => {
    addProgram(createProgram({ university: 'Sorbonne', programName: 'STL' }));
    expect(loadPrograms()).toHaveLength(1);
  });
});

describe('updateProgram', () => {
  it('merges changes', () => {
    const program = createProgram({ university: 'Saclay', programName: 'IRS' });
    addProgram(program);
    const updated = updateProgram(program.id, { status: 'submitted' });
    expect(updated[0].status).toBe('submitted');
  });
});

describe('deleteProgram', () => {
  it('removes a program', () => {
    const program = createProgram({ university: 'Test U', programName: 'Test' });
    addProgram(program);
    expect(deleteProgram(program.id)).toHaveLength(0);
  });
});