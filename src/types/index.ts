export type Course = {
  id: string;
  title: string;
  description: string;
  startDate?: Date | string; // Allow string for initial data, Date for DatePicker
  endDate?: Date | string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  courseId: string;
  createdAt: Date | string; // Store creation timestamp
  // userId: string; // Add later when authentication is implemented
};
