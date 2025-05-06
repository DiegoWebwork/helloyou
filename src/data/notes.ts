'use server';

import type { Note } from '@/types';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const NOTES_COLLECTION = 'notes';

// Helper to map MongoDB document to Note type
const mapMongoDocToNote = (doc: any): Note => {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest } as Note;
};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const { db } = await connectToDatabase();
    const notesDocs = await db.collection(NOTES_COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
    return notesDocs.map(mapMongoDocToNote);
  } catch (error) {
    console.error('Failed to get notes:', error);
    throw new Error('Failed to fetch notes from database.');
  }
};

export const getNotesByCourseId = async (courseId: string): Promise<Note[]> => {
  // courseId is expected to be the string representation of the Course's ObjectId
  if (!ObjectId.isValid(courseId) && !courseId.match(/^[0-9a-fA-F]{24}$/)) {
    // Simple check for a 24-char hex string if it's not a strict ObjectId,
    // as it might be passed as a string ID from Course objects.
    // Ideally, courseId in Note documents should be stored consistently.
    // For this example, we assume courseId in Note schema is a string representation of Course._id
  }
  try {
    const { db } = await connectToDatabase();
    // Querying by courseId which is stored as a string in the Note documents
    const notesDocs = await db.collection(NOTES_COLLECTION).find({ courseId: courseId }).sort({ createdAt: -1 }).toArray();
    return notesDocs.map(mapMongoDocToNote);
  } catch (error) {
    console.error(`Failed to get notes for course ID ${courseId}:`, error);
    throw new Error(`Failed to fetch notes for course ID ${courseId} from database.`);
  }
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  if (!ObjectId.isValid(id)) {
    console.warn(`Invalid ObjectId format for note ID: ${id}`);
    return null;
  }
  try {
    const { db } = await connectToDatabase();
    const noteDoc = await db.collection(NOTES_COLLECTION).findOne({ _id: new ObjectId(id) });
    return noteDoc ? mapMongoDocToNote(noteDoc) : null;
  } catch (error) {
    console.error(`Failed to get note by ID ${id}:`, error);
    throw new Error(`Failed to fetch note with ID ${id} from database.`);
  }
};

export const addNote = async (noteData: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
  try {
    const { db } = await connectToDatabase();
    const noteToInsert = {
      ...noteData,
      createdAt: new Date(), // MongoDB will store this as ISODate
    };
    const result = await db.collection(NOTES_COLLECTION).insertOne(noteToInsert);

    if (!result.insertedId) {
        throw new Error('Failed to insert note, no insertedId returned.');
    }
    const newNoteDoc = await db.collection(NOTES_COLLECTION).findOne({ _id: result.insertedId });
    if (!newNoteDoc) {
        throw new Error('Failed to retrieve newly added note.');
    }
    return mapMongoDocToNote(newNoteDoc);
  } catch (error) {
    console.error('Failed to add note:', error);
    throw new Error('Failed to add note to database.');
  }
};

export const updateNote = async (id: string, noteData: Partial<Omit<Note, 'id' | 'courseId' | 'createdAt'>>): Promise<Note | null> => {
  if (!ObjectId.isValid(id)) {
    console.warn(`Invalid ObjectId format for note ID: ${id} during update`);
    return null;
  }
  try {
    const { db } = await connectToDatabase();
    // Ensure no forbidden fields are passed in $set
    const { courseId, createdAt, ...updatableData } = noteData as any; 

    const result = await db.collection(NOTES_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatableData },
      { returnDocument: 'after' }
    );
    return result ? mapMongoDocToNote(result) : null;
  } catch (error) {
    console.error(`Failed to update note ${id}:`, error);
    throw new Error(`Failed to update note with ID ${id} in database.`);
  }
};

export const deleteNote = async (id: string): Promise<boolean> => {
  if (!ObjectId.isValid(id)) {
    console.warn(`Invalid ObjectId format for note ID: ${id} during delete`);
    return false;
  }
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection(NOTES_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (error) {
    console.error(`Failed to delete note ${id}:`, error);
    throw new Error(`Failed to delete note with ID ${id} from database.`);
  }
};

export const deleteNotesByCourseId = async (courseId: string): Promise<boolean> => {
  // courseId is expected to be the string representation of the Course's ObjectId
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection(NOTES_COLLECTION).deleteMany({ courseId: courseId });
    return result.deletedCount > 0; // Returns true if any notes were deleted
  } catch (error) {
    console.error(`Failed to delete notes for course ID ${courseId}:`, error);
    throw new Error(`Failed to delete notes for course ID ${courseId} from database.`);
  }
};
