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
import { SidebarContext } from '@/contexts/SidebarContext';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { CLEAR_LOCALSTORAGE, KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

const NavigationHeader = () => {
  const { setSidebar, isShow } = useContext(SidebarContext);
  const { items, setItems } = useContext(BreadcrumbContext);

  const pathname = usePathname() ?? '';
  const path = pathname?.slice(1, pathname.length - 1);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const handleMenuClick = () => {
    setSidebar(!isShow);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    path === '' && setItems([{ label: 'Lớp học' }]);
  }, [path, setItems]);

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
          <Breadcrumb>
            <BreadcrumbList>
              {items.map((item, index) => (
                <BreadcrumbItem key={index}>
                  {item.href ? (
                    <Link href={item.href} className="ml-2 text-xl text-black hover:text-green-600 hover:underline">
                      {item.label}
                    </Link>
                  ) : (
                    <BreadcrumbPage
                      className={cn(
                        'ml-2 text-xl text-black',
                        index !== items.length - 1 && ' hover:text-green-600 hover:underline hover:cursor-pointer',
                      )}
                    >
                      {item.label}
                    </BreadcrumbPage>
                  )}
                  {index < items.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
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
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.fullName || user?.userName || 'Anonymous'}</DropdownMenuLabel>
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
