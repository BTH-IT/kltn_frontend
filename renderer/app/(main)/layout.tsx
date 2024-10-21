import React from 'react';
import { Metadata } from 'next';

import NavigationSidebar from '@/components/navigations/NavigationSidebar';
import NavigationHeader from '@/components/navigations/NavigationHeader';
import { CoursesProvider } from '@/contexts/CoursesContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CreateSubjectProvider } from '@/contexts/CreateSubjectContext';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';

export const metadata: Metadata = {
  title: {
    template: '%s | Classroom',
    default: 'Classroom Application',
  },
  description: 'This is classroom for SGUer',
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <CoursesProvider>
      <CourseProvider course={null}>
        <CreateSubjectProvider>
          <SidebarProvider isShow={true}>
            <BreadcrumbProvider>
              <div className="h-full">
                <NavigationHeader />
                <div className="flex">
                  <NavigationSidebar />
                  <main className="flex-1 h-[calc(100vh-70px)] mt-[70px] overflow-y-auto">{children}</main>
                </div>
              </div>
            </BreadcrumbProvider>
          </SidebarProvider>
        </CreateSubjectProvider>
      </CourseProvider>
    </CoursesProvider>
  );
};

export default Layout;
