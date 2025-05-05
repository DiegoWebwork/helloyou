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
  trigger: React.ReactNode;
  course?: Course | null; // Course data for editing, null/undefined for creating
  onSuccess?: () => void; // Optional callback after successful save
}

export function CourseDialog({ trigger, course, onSuccess }: CourseDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!course;

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
