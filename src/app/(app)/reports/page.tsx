"use client";

import { useState, useEffect } from 'react';
import type { Note, Course } from '@/types';
import { getNotes } from '@/data/notes';
import { getCourses } from '@/data/courses';
import { PageHeader } from '@/components/page-header';
import { ReportChart } from '@/components/report/report-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ReportData {
  courseTitle: string;
  noteCount: number;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndGenerateReport = async () => {
      setIsLoading(true);
      try {
        const [notes, courses] = await Promise.all([getNotes(), getCourses()]);

        setTotalCourses(courses.length);
        setTotalNotes(notes.length);

        const notesPerCourse = courses.map(course => {
          const count = notes.filter(note => note.courseId === course.id).length;
          return {
            courseTitle: course.title,
            noteCount: count,
          };
        });

        // Sort by note count descending for better visualization
        notesPerCourse.sort((a, b) => b.noteCount - a.noteCount);

        setReportData(notesPerCourse);
      } catch (error) {
        console.error("Failed to fetch data for report:", error);
        // Optionally show a toast message here
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataAndGenerateReport();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Reports"
        description="Overview of courses and notes activity."
      />
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Total Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalCourses}</p>
                    </CardContent>
                 </Card>
                 <Card>
                     <CardHeader>
                         <CardTitle>Total Notes</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p className="text-4xl font-bold">{totalNotes}</p>
                     </CardContent>
                 </Card>
            </div>
        )}

        {isLoading ? (
           <ChartSkeleton />
        ) : reportData.length > 0 ? (
           <ReportChart
             data={reportData}
             title="Notes per Course"
             description="Number of notes created for each course."
           />
        ) : (
           !isLoading && (
             <Card>
               <CardHeader>
                 <CardTitle>Notes per Course</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-muted-foreground">No course or note data available to generate this report.</p>
               </CardContent>
             </Card>
           )
        )}
      </main>
    </div>
  );
}


// Skeleton components for loading state
function CardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-10 w-1/4" />
            </CardContent>
        </Card>
    );
}

function ChartSkeleton() {
    return (
        <Card>
             <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-[300px] w-full" />
            </CardContent>
        </Card>
    );
}

