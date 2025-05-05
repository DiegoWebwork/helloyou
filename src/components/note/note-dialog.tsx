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
  trigger?: React.ReactNode; // Make trigger optional
  note?: Note | null; // Note data for editing, null/undefined for creating
  courses: Course[]; // List of available courses
  defaultCourseId?: string; // Optional default course selection
  onSuccess?: () => void; // Optional callback after successful save
  // Allow passing Radix Dialog props like open and onOpenChange
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NoteDialog({
    trigger,
    note,
    courses,
    defaultCourseId,
    onSuccess,
    open: controlledOpen,
    onOpenChange: controlledOnOpenChange
}: NoteDialogProps) {
  // Use controlled state if provided, otherwise manage internal state
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const isEditing = !!note;

   const handleSuccess = () => {
     onOpenChange(false); // Close the dialog on success using the appropriate handler
     if (onSuccess) {
       onSuccess(); // Call the parent's success handler (e.g., to refresh data)
     }
   };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Only render DialogTrigger if trigger prop is provided */}
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
