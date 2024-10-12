import React from 'react';
import { Metadata } from 'next';

import SettingHeader from '@/components/pages/settings/SettingHeader';

export const metadata: Metadata = {
  title: {
    template: '%s | User',
    default: 'User settings',
  },
  description: 'Change your user settings',
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SettingHeader />
      <div className="mx-auto w-full">{children}</div>
    </>
  );
};

export default Layout;
