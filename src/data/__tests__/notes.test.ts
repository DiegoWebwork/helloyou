
import { getNotes, getNotesByCourseId, getNoteById, addNote, updateNote, deleteNote, deleteNotesByCourseId } from '../notes';
import { connectToDatabase, mockDb, mockCollection, resetMongoMocks } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Note } from '@/types';

jest.mock('@/lib/mongodb');

const mockedConnectToDatabase = connectToDatabase as jest.Mock;

describe('Note Data Functions', () => {
  beforeEach(() => {
    resetMongoMocks();
  });

  describe('getNotes', () => {
    it('should fetch all notes and sort them by createdAt descending', async () => {
      const mockNoteDocs = [
        { _id: new ObjectId(), title: 'Note 2', content: 'Content 2', courseId: 'c1', createdAt: new Date('2023-01-02') },
        { _id: new ObjectId(), title: 'Note 1', content: 'Content 1', courseId: 'c1', createdAt: new Date('2023-01-01') },
      ];
      // Simulate the sort happening in the mock if find().sort().toArray()
      mockCollection.sort.mockReturnThis(); // find().sort() returns the chainable object
      mockCollection.toArray.mockResolvedValue(mockNoteDocs); // toArray() resolves with the data

      await getNotes();

      expect(mockedConnectToDatabase).toHaveBeenCalledTimes(1);
      expect(mockDb.collection).toHaveBeenCalledWith('notes');
      expect(mockCollection.find).toHaveBeenCalledWith({});
      expect(mockCollection.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockCollection.toArray).toHaveBeenCalledTimes(1);
    });
  });

  describe('getNotesByCourseId', () => {
    it('should fetch notes for a specific courseId', async () => {
      const courseId = new ObjectId().toHexString();
      const mockNoteDocs = [
        { _id: new ObjectId(), title: 'Note 1', content: 'Content 1', courseId: courseId, createdAt: new Date() },
      ];
      mockCollection.sort.mockReturnThis();
      mockCollection.toArray.mockResolvedValue(mockNoteDocs);

      const notes = await getNotesByCourseId(courseId);

      expect(mockDb.collection).toHaveBeenCalledWith('notes');
      expect(mockCollection.find).toHaveBeenCalledWith({ courseId: courseId });
      expect(mockCollection.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(notes).toHaveLength(1);
      expect(notes[0].courseId).toBe(courseId);
    });
  });

  describe('getNoteById', () => {
    it('should return a note if found', async () => {
      const noteId = new ObjectId();
      const mockNoteDoc = { _id: noteId, title: 'Test Note', content: 'Content', courseId: 'c1', createdAt: new Date() };
      mockCollection.findOne.mockResolvedValue(mockNoteDoc);

      const note = await getNoteById(noteId.toHexString());

      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: noteId });
      expect(note?.id).toBe(noteId.toHexString());
    });

    it('should return null for an invalid ObjectId string', async () => {
        const note = await getNoteById('invalid-id');
        expect(note).toBeNull();
    });
  });

  describe('addNote', () => {
    it('should add a note with createdAt and return it', async () => {
      const noteData: Omit<Note, 'id' | 'createdAt'> = { title: 'New Note', content: 'New Content', courseId: 'c1' };
      const insertedId = new ObjectId();
      mockCollection.insertOne.mockResolvedValue({ acknowledged: true, insertedId });
      
      // Mock the findOne call that happens after insert
      const now = new Date(); // Approximate time
      const fullNoteDoc = { _id: insertedId, ...noteData, createdAt: now };
      mockCollection.findOne.mockResolvedValue(fullNoteDoc);


      const newNote = await addNote(noteData);

      expect(mockCollection.insertOne).toHaveBeenCalledWith(expect.objectContaining({
        title: noteData.title,
        content: noteData.content,
        courseId: noteData.courseId,
        createdAt: expect.any(Date), // Check that createdAt is a Date
      }));
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: insertedId });
      expect(newNote.id).toBe(insertedId.toHexString());
      expect(newNote.createdAt).toBeDefined();
    });
  });

  describe('updateNote', () => {
    it('should update a note, not allowing courseId or createdAt to be changed', async () => {
      const noteId = new ObjectId();
      const updates: Partial<Omit<Note, 'id' | 'courseId' | 'createdAt'>> = { title: 'Updated Title' };
      const originalDoc = { _id: noteId, title: 'Old Title', content: 'Old Content', courseId: 'c1', createdAt: new Date() };
      const updatedDoc = { ...originalDoc, title: 'Updated Title' };

      mockCollection.findOneAndUpdate.mockResolvedValue(updatedDoc);

      const result = await updateNote(noteId.toHexString(), updates);

      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: noteId },
        { $set: { title: 'Updated Title' } }, // Only updatable fields
        { returnDocument: 'after' }
      );
      expect(result?.title).toBe('Updated Title');
      expect(result?.courseId).toBe(originalDoc.courseId); // Ensure courseId is not changed
    });

     it('should return null for an invalid ObjectId string during update', async () => {
        const result = await updateNote('invalid-id', { title: 'test' });
        expect(result).toBeNull();
    });
  });

  describe('deleteNote', () => {
    it('should delete a note and return true', async () => {
      const noteId = new ObjectId();
      mockCollection.deleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

      const result = await deleteNote(noteId.toHexString());
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: noteId });
      expect(result).toBe(true);
    });
     it('should return false for an invalid ObjectId string during delete', async () => {
        const result = await deleteNote('invalid-id');
        expect(result).toBe(false);
    });
  });

  describe('deleteNotesByCourseId', () => {
    it('should delete all notes for a given courseId', async () => {
      const courseId = 'c1';
      mockCollection.deleteMany.mockResolvedValue({ acknowledged: true, deletedCount: 3 });

      const result = await deleteNotesByCourseId(courseId);
      expect(mockCollection.deleteMany).toHaveBeenCalledWith({ courseId: courseId });
      expect(result).toBe(true);
    });
  });
});
