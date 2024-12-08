import React from 'react';
import { Metadata } from 'next';

import SettingHeader from '@/components/pages/settings/SettingHeader';

export const metadata: Metadata = {
  title: {
    template: '%s | User',
    default: 'Cài đặt thông tin người dùng',
  },
  description: 'Cài đặt thông tin người dùng',
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

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SettingHeader />
      <div className="w-full mx-auto setting-step-5">{children}</div>
    </>
  );
};

export default Layout;
