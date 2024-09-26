import React from 'react';

import { AssignmentProvider } from '@/contexts/AssignmentContext';
import { IAssignment } from '@/types';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';

export async function generateMetadata({ params }: { params: { courseId: string; assignmentId: string } }) {
  const {
    payload: { data },
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`);

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
  } = await http.get<IAssignment>(`${API_URL.ASSIGNMENTS}/${params.assignmentId}`);

  return (
    <AssignmentProvider assignment={assignement}>
      <div className="w-full max-w-full px-4 py-6">{children}</div>
    </AssignmentProvider>
  );
};

export default Layout;
