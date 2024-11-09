import React from 'react';
import { Metadata } from 'next';

import NavigationSidebar from '@/components/navigations/NavigationSidebar';
import NavigationHeader from '@/components/navigations/NavigationHeader';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CoursesProvider } from '@/contexts/CoursesContext';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';

export const metadata: Metadata = {
  title: {
    template: '%s | User',
    default: 'Cài đặt thông tin người dùng',
  },
  description: 'Cài đặt thông tin người dùng',
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <CoursesProvider>
      <SidebarProvider isShow={true}>
        <div className="h-full">
          <BreadcrumbProvider>
            <NavigationHeader />
            <div className="flex">
              <NavigationSidebar />
              <main className="flex-1 h-[calc(100vh-70px)] mt-[70px] overflow-y-auto">{children}</main>
            </div>
          </BreadcrumbProvider>
        </div>
      </SidebarProvider>
    </CoursesProvider>
  );
};

export default Layout;
