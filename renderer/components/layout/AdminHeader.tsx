'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { CLEAR_LOCALSTORAGE } from '@/utils';
import { cn } from '@/libs/utils';

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';

import { NavigationDashboard } from './NavigationDashboard';

const AdminHeader = () => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    CLEAR_LOCALSTORAGE();
    await fetch('/api/logout', {
      method: 'POST',
    });
    router.refresh();
    router.replace('/login');
  };

  return (
    <>
      {isMounted && (
        <div className="fixed top-0 left-0 right-0 z-20 border-b backdrop-blur supports-backdrop-blur:bg-background/60 bg-background/95">
          <nav className="flex items-center justify-between px-4 h-14">
            <div className="hidden lg:block">
              <Link href={'/'} target="_blank">
                <Image
                  width={1000}
                  height={1000}
                  className="w-[50px] h-[50px] object-cover"
                  src="/images/logo.png"
                  alt="logo"
                />
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

            <div className="flex items-center gap-2">
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
