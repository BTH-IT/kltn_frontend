/* eslint-disable quotes */
import React from 'react';
import { Metadata } from 'next';

import NavigationSidebar from '@/components/navigations/NavigationSidebar';
import NavigationHeader from '@/components/navigations/NavigationHeader';
import { CoursesProvider } from '@/contexts/CoursesContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CreateSubjectProvider } from '@/contexts/CreateSubjectContext';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbContext';
import { getUserFromCookie } from '@/libs/actions';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Courseroom's Dashboard | Courseroom",
    description: 'This is courseroom for SGUer',
    manifest: '/web.manifest',
    icons: {
      icon: '/images/logo-2.png',
      shortcut: '/images/logo-2.png',
      apple: '/images/logo-2.png',
    },
    openGraph: {
      title: 'Courseroom Application',
      description: 'Based on Google Classroom',
      images: [
        {
          url: '/images/shared-image.png',
          width: 1200,
          height: 630,
          alt: 'Courseroom Preview Image',
          type: 'image/png',
        },
      ],
    },
  };
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromCookie();
  return (
    <CoursesProvider user={user}>
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
