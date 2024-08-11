import React from 'react';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';

import '@/styles/globals.scss';
import 'react-quill/dist/quill.snow.css';

import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Classroom Application',
  description: 'Based on Google Classroom',
};

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <NextTopLoader />
        {children}
        <Toaster />
      </body>
    </html>
  );
};
export default MainLayout;
