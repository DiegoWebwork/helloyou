"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer, // Import ChartContainer
  ChartTooltipContent,
  type ChartConfig // Import ChartConfig type
} from "@/components/ui/chart"

interface ReportChartProps {
  data: { courseTitle: string; noteCount: number }[];
  title: string;
  description: string;
}

// Define a basic chart configuration
const chartConfig = {
  noteCount: {
    label: "Notes",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export function ReportChart({ data, title, description }: ReportChartProps) {
  return (
     <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Wrap ResponsiveContainer with ChartContainer and pass config */}
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="courseTitle"
                            stroke="hsl(var(--foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            // Allow more space for labels if needed
                            // interval={0}
                            // angle={-45}
                            // textAnchor="end"
                             tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis
                            stroke="hsl(var(--foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            allowDecimals={false} // Ensure integer ticks
                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                         <Tooltip
                            cursor={{ fill: 'hsl(var(--accent))', radius: 4 }}
                            content={<ChartTooltipContent hideLabel dataKey="noteCount" />} // Pass dataKey explicitly
                         />
                        <Bar dataKey="noteCount" fill="var(--color-noteCount)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
             </ChartContainer>
        </CardContent>
    </Card>
  )
}
