'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MenuIcon } from 'lucide-react';

import { cn } from '@/libs/utils';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

import { NavigationDashboard } from './NavigationDashboard';
import { Button } from '../ui/button';

const AdminHeader = () => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {isMounted && (
        <div className="fixed top-0 right-0 left-0 z-20 border-b backdrop-blur supports-backdrop-blur:bg-background/60 bg-background/95">
          <nav className="flex justify-between items-center px-4 h-14">
            <div className="hidden lg:block">
              <Link href={'/'} target="_blank">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 w-6 h-6"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
              </Link>
            </div>
            <div className={cn('block lg:!hidden')}>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <MenuIcon />
                </SheetTrigger>
                <SheetContent side="left" className="!px-0">
                  <div className="py-4 space-y-4">
                    <div className="px-3 py-2">
                      <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">Overview</h2>
                      <div className="space-y-1">
                        <NavigationDashboard isMobileNav={true} setOpen={setOpen} />
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex gap-2 items-center">
              <Button></Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
