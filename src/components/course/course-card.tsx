import Link from 'next/link';
import type { Course } from '@/types';
import { format } from 'date-fns';
import { Calendar, Edit, Trash2, Eye } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {

  const formatDateSafe = (dateInput?: string | Date): string | null => {
      if (!dateInput) return null;
      try {
          const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
           if (isNaN(date.getTime())) return null; // Invalid date check
          return format(date, 'MMM d, yyyy');
      } catch {
          return null; // Handle potential errors during parsing/formatting
      }
   };

  const startDate = formatDateSafe(course.startDate);
  const endDate = formatDateSafe(course.endDate);

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg">{course.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3 min-h-[3rem]">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {(startDate || endDate) && (
            <div className="flex items-center text-xs text-muted-foreground space-x-2 mb-4">
                <Calendar className="w-3 h-3" />
                <span>
                {startDate ? startDate : 'No start date'}
                {startDate && endDate && ' - '}
                {endDate ? endDate : (startDate ? '' : 'No end date')}
                </span>
            </div>
        )}
         {/* Example Badge - Could be dynamic later */}
         <Badge variant="secondary">Active</Badge>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 border-t pt-4">
         <Link href={`/courses/${course.id}/notes`} passHref>
           <Button variant="outline" size="sm">
             <Eye className="mr-1 h-4 w-4" /> View Notes
           </Button>
         </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(course)}>
          <Edit className="h-4 w-4" />
           <span className="sr-only">Edit Course</span>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
               <span className="sr-only">Delete Course</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course
                "{course.title}" and all associated notes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(course.id)}
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
