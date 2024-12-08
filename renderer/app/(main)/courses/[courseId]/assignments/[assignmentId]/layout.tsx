import React from 'react';

import { API_URL } from '@/constants/endpoints';
import { AssignmentProvider } from '@/contexts/AssignmentContext';
import { GroupContextProvider } from '@/contexts/GroupContext';
import http from '@/libs/http';
import { IAssignment } from '@/types';

export async function generateMetadata({ params }: { params: any }) {
  const {
    payload: { data },
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`);

  return {
    title: `Assignment: ${data?.title}`,
    description: 'Assignment detail',
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
  const {
    payload: { data: assignement },
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`);

  return (
    <GroupContextProvider groups={assignement.groups}>
      <AssignmentProvider assignment={assignement}>
        <div className="w-full max-w-full px-4 py-6">{children}</div>
      </AssignmentProvider>
    </GroupContextProvider>
  );
};

export default Layout;
