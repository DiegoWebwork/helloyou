"use client";

import type { Note, Course } from '@/types';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addNote, updateNote } from '@/data/notes';
import { useRouter } from 'next/navigation';


const noteFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(5, {
    message: "Content must be at least 5 characters.",
  }),
  courseId: z.string({ required_error: "Please select a course." }),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

interface NoteFormProps {
  initialData?: Note | null;
  courses: Course[]; // List of courses to select from
  defaultCourseId?: string; // Optional default course selection
  onSuccess?: () => void;
}

export function NoteForm({ initialData = null, courses, defaultCourseId, onSuccess }: NoteFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      courseId: initialData?.courseId ?? defaultCourseId ?? "",
    },
  });

    async function onSubmit(data: NoteFormValues) {
        try {
        let result;
         const notePayload = {
           title: data.title,
           content: data.content,
           courseId: data.courseId,
         };

        if (isEditing && initialData) {
            result = await updateNote(initialData.id, notePayload);
            toast({
            title: "Note Updated",
            description: `Note "${result?.title}" has been successfully updated.`,
            });
        } else {
            result = await addNote(notePayload);
            toast({
            title: "Note Created",
            description: `Note "${result.title}" has been successfully created.`,
            });
        }
        form.reset();
        if (onSuccess) {
            onSuccess();
        } else {
            // Default behavior if no onSuccess callback is provided
             router.back(); // Go back to the previous page (e.g., notes list)
             router.refresh();
        }
        } catch (error) {
        console.error("Failed to save note:", error);
        toast({
            title: "Error",
            description: `Failed to ${isEditing ? 'update' : 'create'} note. Please try again.`,
            variant: "destructive",
        });
        }
    }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Lecture Summary Week 1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your notes here..."
                  className="resize-y min-h-[150px]" // Allow vertical resize
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
           control={form.control}
           name="courseId"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Course</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                 <FormControl>
                   <SelectTrigger>
                     <SelectValue placeholder="Select a course" />
                   </SelectTrigger>
                 </FormControl>
                 <SelectContent>
                   {courses.map((course) => (
                     <SelectItem key={course.id} value={course.id}>
                       {course.title}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
               <FormMessage />
             </FormItem>
           )}
         />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Update Note' : 'Create Note')}
        </Button>
         {onSuccess && ( // Show cancel button only when used in a dialog/modal
            <Button type="button" variant="outline" onClick={onSuccess} className="ml-2">
                Cancel
            </Button>
         )}
      </form>
    </Form>
  );
}
