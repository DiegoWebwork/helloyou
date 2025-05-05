"use client";

import type { Course } from '@/types';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import { useToast } from "@/hooks/use-toast";
import { addCourse, updateCourse } from '@/data/courses'; // Import data functions
import { useRouter } from 'next/navigation';

const courseFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }).max(500, { message: "Description cannot exceed 500 characters."}),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}).refine(data => {
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: "End date cannot be earlier than start date.",
    path: ["endDate"], // path of error
});


type CourseFormValues = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  initialData?: Course | null; // Make initialData optional and allow null
  onSuccess?: () => void; // Callback on successful submission
}

export function CourseForm({ initialData = null, onSuccess }: CourseFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isEditing = !!initialData;

   // Helper to parse date strings safely
   const parseDate = (dateString?: string | Date): Date | undefined => {
     if (!dateString) return undefined;
     if (dateString instanceof Date) return dateString;
     try {
       const parsed = new Date(dateString);
       return isNaN(parsed.getTime()) ? undefined : parsed;
     } catch (e) {
       return undefined;
     }
   };

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      startDate: parseDate(initialData?.startDate),
      endDate: parseDate(initialData?.endDate),
    },
  });

  async function onSubmit(data: CourseFormValues) {
    try {
      let result;
      const coursePayload = {
        ...data,
        // Convert dates back to ISO string or keep as Date if backend handles it
         startDate: data.startDate ? data.startDate.toISOString().split('T')[0] : undefined, // Format as YYYY-MM-DD string
         endDate: data.endDate ? data.endDate.toISOString().split('T')[0] : undefined,
      };

      if (isEditing && initialData) {
        result = await updateCourse(initialData.id, coursePayload);
        toast({
          title: "Course Updated",
          description: `Course "${result?.title}" has been successfully updated.`,
        });
      } else {
        result = await addCourse(coursePayload);
        toast({
          title: "Course Created",
          description: `Course "${result.title}" has been successfully created.`,
        });
      }
       form.reset(); // Reset form after successful submission
       if (onSuccess) {
           onSuccess(); // Call the callback if provided
       } else {
            router.push('/courses'); // Default redirect
            router.refresh(); // Refresh data on the courses page
       }


    } catch (error) {
        console.error("Failed to save course:", error);
         toast({
            title: "Error",
            description: `Failed to ${isEditing ? 'update' : 'create'} course. Please try again.`,
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
                <Input placeholder="e.g., Introduction to Web Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the course content and objectives."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                 Keep it concise (max 500 characters).
               </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Start Date (Optional)</FormLabel>
                 <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} placeholder="Select start date"/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                 <FormControl>
                    <DatePicker date={field.value} setDate={field.onChange} placeholder="Select end date"/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
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
