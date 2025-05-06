import type { Course } from '@/types';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const COURSES_COLLECTION = 'courses';

// Helper to map MongoDB document to Course type
const mapMongoDocToCourse = (doc: any): Course => {
  if (!doc) return doc; // Handles null or undefined
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest } as Course;
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    const { db } = await connectToDatabase();
    const coursesDocs = await db.collection(COURSES_COLLECTION).find({}).toArray();
    return coursesDocs.map(mapMongoDocToCourse);
  } catch (error) {
    console.error('Failed to get courses:', error);
    throw new Error('Failed to fetch courses from database.');
  }
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  if (!ObjectId.isValid(id)) {
    console.warn(`Invalid ObjectId format for course ID: ${id}`);
    return null;
  }
  try {
    const { db } = await connectToDatabase();
    const courseDoc = await db.collection(COURSES_COLLECTION).findOne({ _id: new ObjectId(id) });
    return courseDoc ? mapMongoDocToCourse(courseDoc) : null;
  } catch (error) {
    console.error(`Failed to get course by ID ${id}:`, error);
    throw new Error(`Failed to fetch course with ID ${id} from database.`);
  }
};

export const addCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  try {
    const { db } = await connectToDatabase();
    const courseToInsert = {
      ...courseData,
      startDate: courseData.startDate ? new Date(courseData.startDate) : undefined,
      endDate: courseData.endDate ? new Date(courseData.endDate) : undefined,
    };
    const result = await db.collection(COURSES_COLLECTION).insertOne(courseToInsert);
    
    if (!result.insertedId) {
        throw new Error('Failed to insert course, no insertedId returned.');
    }
    // Fetch the inserted document to return it in the Course type format
    const newCourseDoc = await db.collection(COURSES_COLLECTION).findOne({ _id: result.insertedId });
    if (!newCourseDoc) {
        throw new Error('Failed to retrieve newly added course.');
    }
    return mapMongoDocToCourse(newCourseDoc);
  } catch (error) {
    console.error('Failed to add course:', error);
    throw new Error('Failed to add course to database.');
  }
};

export const updateCourse = async (id: string, courseData: Partial<Omit<Course, 'id'>>): Promise<Course | null> => {
  if (!ObjectId.isValid(id)) {
     console.warn(`Invalid ObjectId format for course ID: ${id} during update`);
     return null;
  }
  try {
    const { db } = await connectToDatabase();
    const dataToUpdate: any = { ...courseData };
    if (courseData.startDate) {
      dataToUpdate.startDate = new Date(courseData.startDate as string);
    }
    if (courseData.endDate) {
      dataToUpdate.endDate = new Date(courseData.endDate as string);
    }

    const result = await db.collection(COURSES_COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: dataToUpdate },
      { returnDocument: 'after' }
    );
    return result ? mapMongoDocToCourse(result) : null;
  } catch (error) {
    console.error(`Failed to update course ${id}:`, error);
    throw new Error(`Failed to update course with ID ${id} in database.`);
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  if (!ObjectId.isValid(id)) {
    console.warn(`Invalid ObjectId format for course ID: ${id} during delete`);
    return false;
  }
  try {
    const { db } = await connectToDatabase();
    // Note: Associated notes should be handled separately if needed (e.g., deleteNotesByCourseId)
    const result = await db.collection(COURSES_COLLECTION).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  } catch (error) {
    console.error(`Failed to delete course ${id}:`, error);
    throw new Error(`Failed to delete course with ID ${id} from database.`);
  }
};
