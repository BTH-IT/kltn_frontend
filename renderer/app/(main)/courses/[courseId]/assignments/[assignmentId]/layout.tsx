import React from 'react';

import { AssignmentProvider } from '@/contexts/AssignmentContext';
// import http from '@/libs/http';

// export async function generateMetadata({ params }: { params: { classId: string; assignmentId: string } }) {
//   const { data } = await http.get(params.classId, params.assignmentId);

//   return {
//     title: data.title,
//     description: 'Assignment detail',
//   };
// }

const Layout = async ({
  children,
}: // params,
{
  children: React.ReactNode;
  params: { classId: string; assignmentId: string };
}) => {
  // const { data } = await cacheAssignmentFetcher(
  //   params.classId,
  //   params.assignmentId
  // );

  return (
    <>
      <AssignmentProvider assignment={null}>
        <div className="w-full max-w-full px-4 py-6">{children}</div>
      </AssignmentProvider>
    </>
  );
};

export default Layout;
