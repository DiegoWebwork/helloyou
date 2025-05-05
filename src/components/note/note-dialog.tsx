"use client";

import type { Note, Course } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NoteForm } from "./note-form";
import { useState } from 'react';

interface NoteDialogProps {
  trigger: React.ReactNode;
  note?: Note | null; // Note data for editing, null/undefined for creating
  courses: Course[]; // List of available courses
  defaultCourseId?: string; // Optional default course selection
  onSuccess?: () => void; // Optional callback after successful save
}

export function NoteDialog({ trigger, note, courses, defaultCourseId, onSuccess }: NoteDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!note;

   const handleSuccess = () => {
     setOpen(false); // Close the dialog on success
     if (onSuccess) {
       onSuccess(); // Call the parent's success handler (e.g., to refresh data)
     }
   };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Note' : 'Create New Note'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this note.' : 'Fill in the details for the new note.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <NoteForm
            initialData={note}
            courses={courses}
            defaultCourseId={defaultCourseId}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
