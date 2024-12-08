import React from 'react';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer } from 'react-toastify';

import '@/styles/globals.scss';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { GuideProvider } from '@/contexts/GuideContext';
import Guide from '@/components/guides/Guide';

export const metadata: Metadata = {
  title: 'Courseroom Application',
  description: 'Based on Google Classroom',
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logo-2.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Courseroom Application" />
        <meta property="og:description" content="Based on Google Classroom" />
        <meta property="og:image" content="/images/shared-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
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
