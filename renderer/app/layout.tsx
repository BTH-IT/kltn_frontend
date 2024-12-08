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
