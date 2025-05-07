
// src/lib/__mocks__/mongodb.ts
import { ObjectId } from 'mongodb';

// Mock ObjectId generation and validation if necessary or rely on actual ObjectId for simplicity in mock setup
// For basic mocking, we might not need to mock ObjectId itself if tests pass valid string IDs.

export const mockCollection = {
  find: jest.fn().mockReturnThis(), // Allows chaining methods like .sort() or .limit()
  toArray: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
  sort: jest.fn().mockReturnThis(), // For chaining like .sort().toArray()
  // Add other collection methods as needed
};

export const mockDb = {
  collection: jest.fn().mockReturnValue(mockCollection),
};

export const connectToDatabase = jest.fn().mockResolvedValue({
  client: {}, // Mock client object if needed, e.g., { close: jest.fn() }
  db: mockDb,
});

// Helper to reset all mocks for use in beforeEach or afterEach
export const resetMongoMocks = () => {
  connectToDatabase.mockClear().mockResolvedValue({ client: {}, db: mockDb });
  mockDb.collection.mockClear().mockReturnValue(mockCollection);
  
  mockCollection.find.mockClear().mockReturnThis();
  mockCollection.toArray.mockClear();
  mockCollection.findOne.mockClear();
  mockCollection.insertOne.mockClear();
  mockCollection.findOneAndUpdate.mockClear();
  mockCollection.deleteOne.mockClear();
  mockCollection.deleteMany.mockClear();
  mockCollection.sort.mockClear().mockReturnThis();
};
