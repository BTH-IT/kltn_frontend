'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/libs/utils';
import CreateCourseModal from '@/components/modals/CreateCourseModal';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { navigationItemList } from '@/constants/common';
import { CourseContext } from '@/contexts/CourseContext';
import { SidebarContext } from '@/contexts/SidebarContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CLEAR_LOCALSTORAGE, KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';

const NavigationHeader = () => {
  const { setSidebar, isShow } = useContext(SidebarContext);
  const pathname = usePathname() ?? '';
  const path = pathname?.slice(1, pathname.length - 1);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const { course } = useContext(CourseContext);

  const handleMenuClick = () => {
    setSidebar(!isShow);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const user = localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER);
    setUser(user ? JSON.parse(user) : null);
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
    isMounted && (
      <div className="w-full h-[4.5rem] bg-white border-gray-300 border-b-[0.5px] flex items-center justify-between px-4 fixed z-10">
        <div className="flex items-center justify-center">
          <button className="p-3 rounded-full hover:bg-gray-100" onClick={handleMenuClick}>
            <Menu />
          </button>
          {path === '' ? (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="ml-2 text-xl text-black hover:text-green-600 hover:underline hover:cursor-pointer">
                    Lớp học
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          ) : (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <Link href="/" className="ml-2 text-xl text-black hover:text-green-600 hover:underline">
                    Lớp học
                  </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="ml-2 text-xl text-black">
                    {navigationItemList[path] ?? course?.courseGroup}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="flex items-center">
          <CreateCourseModal>
            <button className={cn('mr-4 p-3 rounded-full hover:bg-gray-100', path === '' ? '' : 'hidden')}>
              <Plus />
            </button>
          </CreateCourseModal>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.avatar || '/images/avt.png'} />
                <AvatarFallback>{user?.fullName}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  );
};

export default NavigationHeader;
