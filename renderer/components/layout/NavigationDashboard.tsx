'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/libs/utils';
import { useSidebar } from '@/libs/hooks/useSidebar';
import { ADMIN_NAVIGATION } from '@/constants/common';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface NavigationDashboardProps {
  setOpen?: any;
  isMobileNav?: boolean;
}

export function NavigationDashboard({ setOpen, isMobileNav = false }: NavigationDashboardProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();

  return (
    <nav className="grid gap-2 items-start">
      <TooltipProvider>
        {ADMIN_NAVIGATION.map((item, index) => {
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                      path === item.href ? 'bg-accent' : 'transparent',
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    {item.icon}

                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ''
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
