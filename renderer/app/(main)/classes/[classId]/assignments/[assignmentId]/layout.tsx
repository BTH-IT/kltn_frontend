import React, { cache } from 'react';

import assignmentRequest from '@/libs/requests/assignmentRequest';
import { AssignmentProvider } from '@/contexts/AssignmentContext';

const cacheAssignmentFetcher = cache(assignmentRequest.getDetail);

export async function generateMetadata({ params }: { params: { classId: string; assignmentId: string } }) {
  const { data } = await cacheAssignmentFetcher(params.classId, params.assignmentId);

  return {
    title: data.title,
    description: 'Assignment detail',
  };
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classId: string; assignmentId: string };
}) => {
  const { data } = await cacheAssignmentFetcher(params.classId, params.assignmentId);

  return (
    <>
      <AssignmentProvider assignment={data}>
        <div className="max-w-full w-full px-4 py-6">{children}</div>
      </AssignmentProvider>
    </>
  );
};

export default Layout;
