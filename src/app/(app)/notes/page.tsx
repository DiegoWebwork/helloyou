"use client";

import { useState, useEffect } from 'react';
import type { Note, Course } from '@/types';
import { getNotes, deleteNote as apiDeleteNote } from '@/data/notes';
import { getCourses } from '@/data/courses'; // Need courses for the dropdown
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';
import { NoteCard } from '@/components/note/note-card';
import { NoteDialog } from '@/components/note/note-dialog';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';

export default function AllNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [courses, setCourses] = useState<Course[]>([]); // Store courses for the dialog
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch both notes and courses
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [fetchedNotes, fetchedCourses] = await Promise.all([
        getNotes(),
        getCourses()
      ]);
      setNotes(fetchedNotes);
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Could not load notes or courses. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    fetchData(); // Refresh notes list
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

   // Helper to get course title by ID
   const getCourseTitle = (courseId: string): string | undefined => {
     return courses.find(c => c.id === courseId)?.title;
   };


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="My Notes"
        description="View and manage all your notes across all courses."
        actions={
            <NoteDialog
                trigger={
                <Button size="sm" disabled={courses.length === 0} onClick={handleAddNew}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Note
                </Button>
                }
                courses={courses} // Pass courses to the dialog
                onSuccess={handleDialogSuccess}
            />
        }
      />
      <main className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => <NoteCardSkeleton key={i} />)}
            </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                courseTitle={getCourseTitle(note.courseId)}
                onEdit={() => handleEdit(note)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-semibold">No notes yet</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {courses.length > 0
                 ? "Create your first note using the button above."
                 : "Create a course before you can add notes."}
            </p>
              {courses.length > 0 && (
                <NoteDialog
                    trigger={
                        <Button size="sm" onClick={handleAddNew}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                             Add New Note
                        </Button>
                    }
                    courses={courses}
                    onSuccess={handleDialogSuccess}
                />
              )}
          </div>
        )}
      </main>

       {/* Separate Dialog instance for editing/adding */}
       <NoteDialog
         open={isDialogOpen}
         onOpenChange={setIsDialogOpen}
         note={editingNote}
         courses={courses}
         onSuccess={handleDialogSuccess}
         // Trigger is removed here as it's controlled by open/onOpenChange state
       />
    </div>
  );
}


// Skeleton component for Note Card
function NoteCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-card shadow">
      <Skeleton className="h-5 w-3/4" /> {/* Title */}
      <Skeleton className="h-4 w-1/2" /> {/* Course Title (optional) */}
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
