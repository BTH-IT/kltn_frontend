import React, { cache, Suspense } from 'react';
import { Metadata } from 'next';

import NavigationSidebar from '@/components/navigations/NavigationSidebar';
import NavigationHeader from '@/components/navigations/NavigationHeader';
import { Toaster } from '@/components/ui/toaster';
import { ClassesProvider } from '@/contexts/ClassesContext';
import Loading from '@/components/loading/loading';
import { ClassProvider } from '@/contexts/ClassContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { CreateSubjectProvider } from '@/contexts/CreateSubjectContext';
import { ApiResponse, ISubject } from '@/types';
import { fetcher } from '@/actions';
import { API_URL } from '@/constants/endpoints';

const cacheFetcher = cache(fetcher);

export const metadata: Metadata = {
  title: {
    template: '%s | Classroom',
    default: 'Classroom Application',
  },
  description: 'This is classroom for SGUer',
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { data: subjects } = await cacheFetcher<ApiResponse<ISubject[]>>(API_URL.SUBJECTS);

  return (
    <ClassesProvider>
      <ClassProvider classes={null}>
        <CreateSubjectProvider subjects={subjects}>
          <Suspense fallback={<Loading />}>
            <SidebarProvider isShow={true}>
              <div className="h-full">
                <NavigationHeader />
                <div className="flex">
                  <NavigationSidebar userId={'âsd'} />
                  <main className="flex-1 h-[calc(100vh-70px)] mt-[70px] overflow-y-auto">{children}</main>
                </div>
                <Toaster />
              </div>
            </SidebarProvider>
          </Suspense>
        </CreateSubjectProvider>
      </ClassProvider>
    </ClassesProvider>
  );
};

export default Layout;
