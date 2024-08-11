import React from 'react';
import type { Metadata } from 'next';

import AdminHeader from '@/components/layout/AdminHeader';
import AdminSidebar from '@/components/layout/AdminSidebar';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminHeader />
      <div className="flex overflow-hidden h-screen">
        <AdminSidebar />
        <main className="overflow-hidden flex-1 pt-16">{children}</main>
      </div>
    </>
  );
}
