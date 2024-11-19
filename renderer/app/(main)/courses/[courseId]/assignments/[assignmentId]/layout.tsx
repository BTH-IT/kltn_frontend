import React from 'react';

import { API_URL } from '@/constants/endpoints';
import { AssignmentProvider } from '@/contexts/AssignmentContext';
import { GroupContextProvider } from '@/contexts/GroupContext';
import http from '@/libs/http';
import { IAssignment } from '@/types';
import { revalidate } from '@/libs/utils';

export async function generateMetadata({ params }: { params: { courseId: string; assignmentId: string } }) {
  const {
    payload: { data },
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`, {
    next: { revalidate: revalidate },
  });

  return {
    title: `Assignment: ${data?.title}`,
    description: 'Assignment detail',
  };
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string; assignmentId: string };
}) => {
  const {
    payload: { data: assignement },
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`, {
    next: { revalidate: revalidate },
  });

  return (
    <GroupContextProvider groups={assignement.groups}>
      <AssignmentProvider assignment={assignement}>
        <div className="w-full max-w-full px-4 py-6">{children}</div>
      </AssignmentProvider>
    </GroupContextProvider>
  );
};

export default Layout;
