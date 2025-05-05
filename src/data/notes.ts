import type { Note } from '@/types';

// Temporary in-memory storage for notes
// Replace with actual database/JSON file logic later
let notes: Note[] = [
  { id: 'n1', courseId: '1', title: 'React Basics', content: 'Components, props, state.', createdAt: new Date() },
  { id: 'n2', courseId: '1', title: 'Hooks Intro', content: 'useState, useEffect.', createdAt: new Date() },
  { id: 'n3', courseId: '2', title: 'Server Components', content: 'Understanding RSCs.', createdAt: new Date() },
];

export const getNotes = async (): Promise<Note[]> => {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50));
  return notes;
};

export const getNotesByCourseId = async (courseId: string): Promise<Note[]> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return notes.filter(note => note.courseId === courseId);
};


export const getNoteById = async (id: string): Promise<Note | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return notes.find(note => note.id === id);
};


export const addNote = async (noteData: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newNote: Note = {
        ...noteData,
        id: `n${Date.now()}`, // Simple ID generation
        createdAt: new Date(),
    };
    notes.push(newNote);
    return newNote;
};

export const updateNote = async (id: string, noteData: Partial<Omit<Note, 'id' | 'courseId' | 'createdAt'>>): Promise<Note | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const noteIndex = notes.findIndex(n => n.id === id);
    if (noteIndex === -1) {
        return undefined;
    }
    notes[noteIndex] = { ...notes[noteIndex], ...noteData };
    return notes[noteIndex];
};

export const deleteNote = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const initialLength = notes.length;
    notes = notes.filter(note => note.id !== id);
    return notes.length < initialLength;
};

export const deleteNotesByCourseId = async (courseId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const initialLength = notes.length;
    notes = notes.filter(note => note.courseId !== courseId);
    return notes.length < initialLength;
};
