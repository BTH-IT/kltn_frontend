import React from 'react';
import { Metadata } from 'next';

import NavigationSidebar from '@/components/navigations/NavigationSidebar';
import NavigationHeader from '@/components/navigations/NavigationHeader';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CoursesProvider } from '@/contexts/CoursesContext';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';
import { getUserFromCookie } from '@/libs/actions';
import { metadataConfig } from '@/utils';

export const metadata: Metadata = {
  title: {
    template: '%s | User',
    default: 'Cài đặt thông tin người dùng',
  },
  description: 'Cài đặt thông tin người dùng',
  ...metadataConfig,
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromCookie();

  return (
    <CoursesProvider user={user}>
      <SidebarProvider isShow={true}>
        <BreadcrumbProvider>
          <NavigationHeader />
          <div className="flex">
            <NavigationSidebar />
            <main className="flex-1 h-[calc(100vh-70px)] mt-[70px] overflow-x-hidden">{children}</main>
          </div>
        </BreadcrumbProvider>
      </SidebarProvider>
    </CoursesProvider>
  );
};

export default Layout;
