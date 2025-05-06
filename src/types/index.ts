export type Course = {
  id: string; // Represents MongoDB _id.toHexString()
  title: string;
  description: string;
  startDate?: Date | string; // Stored as ISODate in MongoDB
  endDate?: Date | string;   // Stored as ISODate in MongoDB
};

export type Note = {
  id: string; // Represents MongoDB _id.toHexString()
  title: string;
  content: string;
  courseId: string; // This will be the string representation of the related Course's _id
  createdAt: Date | string; // Stored as ISODate in MongoDB
  // userId: string; // Add later when authentication is implemented
};
