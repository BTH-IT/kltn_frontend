'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';

import { useSidebar } from '@/libs/hooks/useSidebar';
import { cn } from '@/libs/utils';

import { NavigationDashboard } from './NavigationDashboard';

const AdminSidebar = () => {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <>
      {isMounted && (
        <nav
          className={cn(
            'relative hidden h-screen flex-none border-r z-10 pt-12 md:block',
            status && 'duration-500',
            !isMinimized ? 'w-72' : 'w-[72px]',
          )}
        >
          <ChevronLeft
            className={cn(
              'absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground',
              isMinimized && 'rotate-180',
            )}
            onClick={handleToggle}
          />
          <div className="py-4 space-y-4">
            <div className="px-3 py-2">
              <div className="mt-3 space-y-1">
                <NavigationDashboard />
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default AdminSidebar;
