import React from 'react';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer />
      </body>
    </html>
  );
};
export default MainLayout;
