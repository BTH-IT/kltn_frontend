import React from 'react';
import { redirect } from 'next/navigation';

import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ICourse, IGroup } from '@/types';
import GroupHeader from '@/components/common/GroupHeader';

export async function generateMetadata({ params }: { params: any }) {
  const { payload } = await http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`);

  return {
    title: payload.data.groupName + ' - Group detail',
    description: 'Group detail',
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
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: any }) => {
  const [groupData, courseData] = await Promise.all([
    http.get<IGroup>(`${API_URL.GROUPS}/${params.groupId}`),
    http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`) as Promise<any>,
  ]);

  const group = groupData.payload?.data;
  const course = courseData.payload?.data;

  if (!group || !course) {
    return redirect('/');
  }

  return (
    <section className="p-6">
      <GroupHeader data={params} />
      {children}
    </section>
  );
};

export default Layout;
