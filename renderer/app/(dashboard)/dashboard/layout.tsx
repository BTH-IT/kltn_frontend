import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import AdminHeader from '@/components/layout/AdminHeader';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { getRoleFromCookie } from '@/libs/actions';

export const metadata: Metadata = {
  title: 'Dashboard | Courseroom',
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

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const role = (await getRoleFromCookie()) || 'user';

  if (role.toLowerCase() !== 'admin') {
    redirect('/');
  }

  return (
    <>
      <AdminHeader />
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 pt-16 overflow-x-hidden overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
