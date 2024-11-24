import React from 'react';
import type { Metadata } from 'next';

import AdminHeader from '@/components/layout/AdminHeader';
import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata: Metadata = {
  title: 'Dashboard | Courseroom',
  description: 'Based on Google Classroom',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
