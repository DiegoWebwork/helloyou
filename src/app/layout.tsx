import type { Metadata } from 'next';
import { Geist } from 'next/font/google'; // Use Geist directly
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans', // Ensure this variable is used
});


export const metadata: Metadata = {
  title: 'CourseNote',
  description: 'Course and Note Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans antialiased`}> {/* Apply the font variable */}
        <SidebarProvider>
          {children}
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
