
import { getCourses, getCourseById, addCourse, updateCourse, deleteCourse } from '../courses';
import { connectToDatabase, mockDb, mockCollection, resetMongoMocks } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Course } from '@/types';

jest.mock('@/lib/mongodb'); // This will use the mock from src/lib/__mocks__/mongodb.ts

const mockedConnectToDatabase = connectToDatabase as jest.Mock;

describe('Course Data Functions', () => {
  beforeEach(() => {
    resetMongoMocks(); // Reset all mocks before each test
  });

  describe('getCourses', () => {
    it('should fetch and return all courses mapped correctly', async () => {
      const mockCourseDocs = [
        { _id: new ObjectId(), title: 'Course 1', description: 'Desc 1', startDate: new Date(), endDate: new Date() },
        { _id: new ObjectId(), title: 'Course 2', description: 'Desc 2' },
      ];
      mockCollection.toArray.mockResolvedValue(mockCourseDocs);

      const courses = await getCourses();

      expect(mockedConnectToDatabase).toHaveBeenCalledTimes(1);
      expect(mockDb.collection).toHaveBeenCalledWith('courses');
      expect(mockCollection.find).toHaveBeenCalledWith({});
      expect(mockCollection.toArray).toHaveBeenCalledTimes(1);
      expect(courses).toHaveLength(mockCourseDocs.length);
      expect(courses[0].id).toBe(mockCourseDocs[0]._id.toHexString());
      expect(courses[0].title).toBe(mockCourseDocs[0].title);
    });

    it('should throw an error if database call fails', async () => {
      mockCollection.toArray.mockRejectedValue(new Error('DB error'));
      await expect(getCourses()).rejects.toThrow('Failed to fetch courses from database.');
    });
  });

  describe('getCourseById', () => {
    it('should return a course if found', async () => {
      const courseId = new ObjectId();
      const mockCourseDoc = { _id: courseId, title: 'Test Course', description: 'Test Desc' };
      mockCollection.findOne.mockResolvedValue(mockCourseDoc);

      const course = await getCourseById(courseId.toHexString());

      expect(mockDb.collection).toHaveBeenCalledWith('courses');
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: courseId });
      expect(course).not.toBeNull();
      expect(course?.id).toBe(courseId.toHexString());
      expect(course?.title).toBe(mockCourseDoc.title);
    });

    it('should return null if course not found', async () => {
      const courseId = new ObjectId().toHexString();
      mockCollection.findOne.mockResolvedValue(null);
      const course = await getCourseById(courseId);
      expect(course).toBeNull();
    });

    it('should return null for an invalid ObjectId string', async () => {
        const course = await getCourseById('invalid-id');
        expect(course).toBeNull();
        expect(mockCollection.findOne).not.toHaveBeenCalled();
    });
  });

  describe('addCourse', () => {
    it('should add a course and return it mapped correctly', async () => {
      const courseData: Omit<Course, 'id'> = { title: 'New Course', description: 'New Desc' };
      const insertedId = new ObjectId();
      mockCollection.insertOne.mockResolvedValue({ acknowledged: true, insertedId });
      // Mock the findOne call that happens after insert to retrieve the document
      const fullCourseDoc = { _id: insertedId, ...courseData, startDate: undefined, endDate: undefined };
      mockCollection.findOne.mockResolvedValue(fullCourseDoc);


      const newCourse = await addCourse(courseData);

      expect(mockDb.collection).toHaveBeenCalledWith('courses');
      expect(mockCollection.insertOne).toHaveBeenCalledWith({
        ...courseData,
        startDate: undefined, // Ensure dates are handled
        endDate: undefined,
      });
      expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: insertedId });
      expect(newCourse.id).toBe(insertedId.toHexString());
      expect(newCourse.title).toBe(courseData.title);
    });

    it('should handle date strings correctly when adding a course', async () => {
        const courseData: Omit<Course, 'id'> = { 
            title: 'Dated Course', 
            description: 'Desc',
            startDate: '2024-01-01',
            endDate: '2024-12-31'
        };
        const insertedId = new ObjectId();
        mockCollection.insertOne.mockResolvedValue({ acknowledged: true, insertedId });
        const fullCourseDoc = { 
            _id: insertedId, 
            ...courseData, 
            startDate: new Date(courseData.startDate as string), 
            endDate: new Date(courseData.endDate as string) 
        };
        mockCollection.findOne.mockResolvedValue(fullCourseDoc);

        await addCourse(courseData);

        expect(mockCollection.insertOne).toHaveBeenCalledWith({
            title: 'Dated Course',
            description: 'Desc',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-12-31'),
        });
    });
  });

  describe('updateCourse', () => {
    it('should update a course and return the updated document', async () => {
      const courseId = new ObjectId();
      const updates: Partial<Omit<Course, 'id'>> = { title: 'Updated Title' };
      const updatedDoc = { _id: courseId, title: 'Updated Title', description: 'Original Desc' };
      mockCollection.findOneAndUpdate.mockResolvedValue(updatedDoc);

      const result = await updateCourse(courseId.toHexString(), updates);

      expect(mockDb.collection).toHaveBeenCalledWith('courses');
      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: courseId },
        { $set: updates },
        { returnDocument: 'after' }
      );
      expect(result?.title).toBe('Updated Title');
    });
     it('should return null for an invalid ObjectId string during update', async () => {
        const result = await updateCourse('invalid-id', { title: 'test' });
        expect(result).toBeNull();
        expect(mockCollection.findOneAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course and return true on success', async () => {
      const courseId = new ObjectId();
      mockCollection.deleteOne.mockResolvedValue({ acknowledged: true, deletedCount: 1 });

      const result = await deleteCourse(courseId.toHexString());

      expect(mockDb.collection).toHaveBeenCalledWith('courses');
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ _id: courseId });
      expect(result).toBe(true);
    });

     it('should return false for an invalid ObjectId string during delete', async () => {
        const result = await deleteCourse('invalid-id');
        expect(result).toBe(false);
        expect(mockCollection.deleteOne).not.toHaveBeenCalled();
    });
  });
});
