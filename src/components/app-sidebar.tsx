"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FileText, BarChart3, Home, Settings } from 'lucide-react';

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

const navItems = [
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/notes', label: 'My Notes', icon: FileText },
  { href: '/reports', label: 'Reports', icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();

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
                  isActive={pathname.startsWith(item.href)}
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
       <SidebarFooter className="p-2">
         {/* Add user profile/settings later */}
         <Button variant="ghost" className="justify-start gap-2 w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0">
           <Settings />
           <span className="group-data-[collapsible=icon]:hidden">Settings</span>
         </Button>
       </SidebarFooter>
    </Sidebar>
  );
}
