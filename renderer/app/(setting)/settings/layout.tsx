import React from 'react';
import { Metadata } from 'next';

import SettingHeader from '@/components/pages/settings/SettingHeader';
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
  return (
    <>
      <SettingHeader />
      <div className="w-full mx-auto setting-step-5">{children}</div>
    </>
  );
};

export default Layout;
