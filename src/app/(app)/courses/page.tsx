"use client"; // Required for useState, useEffect, event handlers

import { useState, useEffect } from 'react';
import type { Course } from '@/types';
import { getCourses, deleteCourse as apiDeleteCourse } from '@/data/courses'; // Use data fetching functions
import { deleteNotesByCourseId } from '@/data/notes'; // To delete related notes
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';
import { CourseCard } from '@/components/course/course-card';
import { CourseDialog } from '@/components/course/course-dialog';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast({
        title: "Error",
        description: "Could not load courses. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
       setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []); // Fetch courses on initial mount

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true); // Open dialog for editing
  };

   const handleAddNew = () => {
    setEditingCourse(null); // Clear editing state for adding new
    setIsDialogOpen(true); // Open dialog for adding
   };

   const handleDialogSuccess = () => {
     setIsDialogOpen(false); // Close dialog
     fetchCourses(); // Refresh the course list
   };

    const handleDelete = async (courseId: string) => {
        try {
        // First delete associated notes
        await deleteNotesByCourseId(courseId);
        // Then delete the course
        const success = await apiDeleteCourse(courseId);
        if (success) {
            toast({
            title: "Course Deleted",
            description: "The course and its notes have been successfully deleted.",
            });
            fetchCourses(); // Refresh list after deletion
        } else {
            throw new Error("Course deletion failed.");
        }
        } catch (error) {
        console.error("Failed to delete course:", error);
        toast({
            title: "Error",
            description: "Failed to delete the course. Please try again.",
            variant: "destructive",
        });
        }
    };


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Courses"
        description="Manage your courses and associated notes."
        actions={
           <CourseDialog
              trigger={
                 <Button size="sm">
                     <PlusCircle className="mr-2 h-4 w-4" />
                     Add New Course
                 </Button>
              }
              onSuccess={handleDialogSuccess}
             />
        }
      />
        <main className="flex-1 overflow-y-auto p-6">
         {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => ( // Display 6 skeleton cards
                 <CardSkeleton key={i} />
               ))}
            </div>
         ) : courses.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {courses.map((course) => (
               <CourseCard
                 key={course.id}
                 course={course}
                 onEdit={() => handleEdit(course)} // Pass the specific course to edit
                 onDelete={handleDelete}
               />
             ))}
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center h-full text-center">
             <h3 className="text-xl font-semibold">No courses yet</h3>
             <p className="text-muted-foreground mt-2">
               Get started by adding your first course.
             </p>
              <CourseDialog
                trigger={
                    <Button size="sm" className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Course
                    </Button>
                }
                 onSuccess={handleDialogSuccess}
               />
           </div>
         )}
       </main>

       {/* Separate Dialog instance controlled by state */}
       <CourseDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            course={editingCourse}
            onSuccess={handleDialogSuccess}
            trigger={<></>} // Empty trigger, managed by state
        />

    </div>
  );
}

// Skeleton component for Course Card
function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card shadow">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
