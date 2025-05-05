import type { Note } from '@/types';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NoteCardProps {
  note: Note;
  courseTitle?: string; // Optional: Display course title if available
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
}

export function NoteCard({ note, courseTitle, onEdit, onDelete }: NoteCardProps) {

   const formatDateSafe = (dateInput?: string | Date): string | null => {
      if (!dateInput) return null;
      try {
          const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
          if (isNaN(date.getTime())) return null; // Invalid date check
          return format(date, 'MMM d, yyyy HH:mm'); // Include time
      } catch {
          return null;
      }
   };

   const createdAt = formatDateSafe(note.createdAt);


  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">{note.title}</CardTitle>
        {courseTitle && <CardDescription className="text-sm text-primary">{courseTitle}</CardDescription>}
        <CardDescription className="text-sm line-clamp-4 min-h-[4rem] pt-2">{note.content}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
          {createdAt && (
              <div className="flex items-center text-xs text-muted-foreground space-x-1 mt-2">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {createdAt}</span>
              </div>
          )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 border-t pt-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(note)}>
          <Edit className="h-4 w-4" />
           <span className="sr-only">Edit Note</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Note</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note
                "{note.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(note.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardFooter>
    </Card>
  );
}
