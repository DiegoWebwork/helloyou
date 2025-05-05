import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex items-center justify-between gap-4 py-4 px-6 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10", className)}>
       <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
        </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
