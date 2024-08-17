'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Menu, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { cn } from '@/libs/utils';
import CreateClassModal from '@/components/modals/CreateClassModal';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { navigationItemList } from '@/constants/common';
import { ClassContext } from '@/contexts/ClassContext';
import { SidebarContext } from '@/contexts/SidebarContext';

const NavigationHeader = () => {
  const { setSidebar, isShow } = useContext(SidebarContext);
  const pathname = usePathname() ?? '';
  const path = pathname?.slice(1, pathname.length - 1);

  const { classes } = useContext(ClassContext);

  const handleMenuClick = () => {
    setSidebar(!isShow);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
                    {navigationItemList[path] ?? classes?.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <div className="flex items-center">
          <CreateClassModal>
            <button className={cn('mr-4 p-3 rounded-full hover:bg-gray-100', path === '' ? '' : 'hidden')}>
              <Plus />
            </button>
          </CreateClassModal>
          {/* dawdad */}
        </div>
      </div>
    )
  );
};

export default NavigationHeader;
