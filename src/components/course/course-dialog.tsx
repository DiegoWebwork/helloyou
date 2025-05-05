"use client";

import type { Course } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CourseForm } from "./course-form";
import { useState } from 'react';

interface CourseDialogProps {
  trigger?: React.ReactNode; // Make trigger optional
  course?: Course | null; // Course data for editing, null/undefined for creating
  onSuccess?: () => void; // Optional callback after successful save
  // Allow passing Radix Dialog props like open and onOpenChange
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CourseDialog({ trigger, course, onSuccess, open: controlledOpen, onOpenChange: controlledOnOpenChange }: CourseDialogProps) {
  // Use controlled state if provided, otherwise manage internal state
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const onOpenChange = controlledOnOpenChange ?? setInternalOpen;

  const isEditing = !!course;

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
          <DialogTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this course.' : 'Fill in the details for the new course.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
           <CourseForm initialData={course} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
