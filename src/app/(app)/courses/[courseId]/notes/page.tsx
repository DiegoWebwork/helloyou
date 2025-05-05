"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Use next/navigation
import type { Note, Course } from '@/types';
import { getNotesByCourseId, deleteNote as apiDeleteNote } from '@/data/notes';
import { getCourseById, getCourses } from '@/data/courses';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, ArrowLeft } from 'lucide-react';
import { NoteCard } from '@/components/note/note-card';
import { NoteDialog } from '@/components/note/note-dialog';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function CourseNotesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string; // Get courseId from route params

  const [notes, setNotes] = useState<Note[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
   const [allCourses, setAllCourses] = useState<Course[]>([]); // Need this for the dialog
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const [fetchedNotes, fetchedCourse, fetchedAllCourses] = await Promise.all([
         getNotesByCourseId(courseId),
         getCourseById(courseId),
         getCourses() // Fetch all courses for the dialog dropdown
      ]);

      if (!fetchedCourse) {
          toast({ title: "Error", description: "Course not found.", variant: "destructive" });
          router.push('/courses'); // Redirect if course doesn't exist
          return;
      }

      setNotes(fetchedNotes);
      setCourse(fetchedCourse);
      setAllCourses(fetchedAllCourses); // Set all courses
    } catch (error) {
      console.error("Failed to fetch course data:", error);
      toast({
        title: "Error",
        description: "Could not load course notes. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]); // Refetch if courseId changes

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingNote(null);
    setIsDialogOpen(true);
  };

   const handleDialogSuccess = () => {
     setIsDialogOpen(false);
     fetchData(); // Refresh notes list for this course
   };

  const handleDelete = async (noteId: string) => {
    try {
      const success = await apiDeleteNote(noteId);
      if (success) {
        toast({
          title: "Note Deleted",
          description: "The note has been successfully deleted.",
        });
        fetchData(); // Refresh list
      } else {
        throw new Error("Note deletion failed.");
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast({
        title: "Error",
        description: "Failed to delete the note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={isLoading ? 'Loading...' : `Notes for ${course?.title ?? 'Course'}`}
        description={isLoading ? '' : course?.description ?? ''}
        actions={
           <>
             <Link href="/courses" passHref>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
                </Button>
            </Link>
            <NoteDialog
                trigger={
                    <Button size="sm" disabled={!course}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Note to this Course
                    </Button>
                }
                courses={allCourses} // Pass all courses
                defaultCourseId={courseId} // Pre-select current course
                onSuccess={handleDialogSuccess}
            />
           </>
        }
      />
      <main className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(3)].map((_, i) => <NoteCardSkeleton key={i} />)}
           </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                // No need to show course title here as it's implicit
                onEdit={() => handleEdit(note)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-semibold">No notes for this course yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              Add your first note using the button above.
            </p>
             <NoteDialog
                trigger={
                    <Button size="sm" disabled={!course}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Note to this Course
                    </Button>
                }
                courses={allCourses}
                defaultCourseId={courseId}
                onSuccess={handleDialogSuccess}
            />
          </div>
        )}
      </main>

        {/* Separate Dialog instance for editing/adding */}
       <NoteDialog
         open={isDialogOpen}
         onOpenChange={setIsDialogOpen}
         note={editingNote}
         courses={allCourses} // Pass all courses here too
         defaultCourseId={courseId} // Ensure default is set
         onSuccess={handleDialogSuccess}
         trigger={<></>} // Empty trigger, managed by state
       />
    </div>
  );
}

// Re-use the skeleton from the all notes page or define specifically if needed
function NoteCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card shadow">
      <Skeleton className="h-5 w-3/4" /> {/* Title */}
      {/* No course title needed here */}
      <Skeleton className="h-4 w-full" /> {/* Content line 1 */}
      <Skeleton className="h-4 w-full" /> {/* Content line 2 */}
      <Skeleton className="h-4 w-5/6" /> {/* Content line 3 */}
      <Skeleton className="h-3 w-1/3 mt-2" /> {/* Created At */}
      <div className="flex justify-end items-center pt-4 border-t mt-3">
        <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" /> {/* Edit button */}
            <Skeleton className="h-8 w-8" /> {/* Delete button */}
        </div>
      </div>
    </div>
  );
}
