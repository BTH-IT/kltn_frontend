import React from 'react';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { GuideProvider } from '@/contexts/GuideContext';
import Guide from '@/components/guides/Guide';
import { metadataConfig } from '@/utils';

export const metadata: Metadata = {
  title: 'Courseroom Application',
  description: 'Based on Google Classroom',
  ...metadataConfig,
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="vi">
      <body className="overflow-y-hidden main-step">
        <GuideProvider isShow={false} steps={[]}>
          <NextTopLoader />
          {children}
          <ToastContainer />
          <Guide />
        </GuideProvider>
      </body>
    </html>
  );
};
export default MainLayout;
