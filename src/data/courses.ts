import type { Course } from '@/types';

// Temporary in-memory storage for courses
// Replace with actual database/JSON file logic later
let courses: Course[] = [
  { id: '1', title: 'Introduction to React', description: 'Learn the fundamentals of React.', startDate: '2024-09-01', endDate: '2024-10-01' },
  { id: '2', title: 'Advanced Next.js', description: 'Deep dive into Next.js features.', startDate: '2024-10-15' },
  { id: '3', title: 'State Management with Zustand', description: 'Manage state effectively.', endDate: '2024-11-30' },
];

export const getCourses = async (): Promise<Course[]> => {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 50)); // Small delay
  return courses;
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    return courses.find(course => course.id === id);
};


export const addCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newCourse: Course = {
        ...courseData,
        id: String(Date.now()), // Simple ID generation for now
    };
    courses.push(newCourse);
    return newCourse;
};

export const updateCourse = async (id: string, courseData: Partial<Omit<Course, 'id'>>): Promise<Course | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const courseIndex = courses.findIndex(c => c.id === id);
    if (courseIndex === -1) {
        return undefined;
    }
    courses[courseIndex] = { ...courses[courseIndex], ...courseData };
    return courses[courseIndex];
};


export const deleteCourse = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 50));
    const initialLength = courses.length;
    courses = courses.filter(course => course.id !== id);
    // Also delete associated notes (implement this in notes.ts)
    // await deleteNotesByCourseId(id);
    return courses.length < initialLength;
};
