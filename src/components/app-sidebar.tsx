
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, BarChart3, Home, Settings, FileJson } from 'lucide-react'; // Added FileJson for API Docs

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth

const navItems = [
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/notes', label: 'My Notes', icon: FileText },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
  { href: '/swagger', label: 'API Docs', icon: FileJson }, // Added API Docs link
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading, signOutUser } = useAuth(); // Get user, loading state and signOutUser from context

  const handleSignOut = async () => {
    try {
      await signOutUser();
      // router.push('/auth/login'); // Redirect to login page after sign out
    } catch (error) {
      console.error("Failed to sign out:", error);
      // Handle sign out error (e.g., show a toast)
    }
  };


  return (
    <Sidebar collapsible="icon">
       <SidebarHeader className="items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-2 group-data-[state=collapsed]:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.528a.75.75 0 0 0 .5.707A9.735 9.735 0 0 0 6 21a9.707 9.707 0 0 0 5.25-1.533v-1.567a7.954 7.954 0 0 1-1.5.167A8.235 8.235 0 0 1 4.5 19.445V4.555A8.235 8.235 0 0 1 9.75 4.367v.166ZM12.75 4.533V19.467a7.954 7.954 0 0 1 1.5.167A8.235 8.235 0 0 0 19.5 19.445V4.555A8.235 8.235 0 0 0 14.25 4.367v.166a9.707 9.707 0 0 0 5.25 1.533.75.75 0 0 0 .5-.707V3.75a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533Z" />
                </svg>
                <span className="text-lg font-semibold text-primary">CourseNote</span>
            </Link>
            <div className="group-data-[state=expanded]:hidden">
              <SidebarTrigger />
            </div>
        </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter className="p-2 flex flex-col gap-2">
         {/* User info and Sign Out Button */}
         {loading ? (
            <div className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden p-2 text-center">Loading user...</div>
         ) : user ? (
           <>
             <div className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden p-2 truncate">
               Logged in as: {user.email}
             </div>
             <Button variant="ghost" className="justify-start gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0" onClick={handleSignOut}>
               <Settings /> {/* Replace with LogOut icon if available/preferred */}
               <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
             </Button>
           </>
         ) : (
            <Link href="/auth/login" passHref legacyBehavior>
                 <SidebarMenuButton asChild tooltip="Login">
                      <a>
                         <Settings /> {/* Replace with LogIn icon */}
                         <span className="group-data-[collapsible=icon]:hidden">Login</span>
                       </a>
                 </SidebarMenuButton>
            </Link>
         )}
       </SidebarFooter>
    </Sidebar>
  );
}
