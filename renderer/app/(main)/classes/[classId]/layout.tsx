import React, { cache } from 'react';

import ClassesHeader from '@/components/pages/classes/ClassesHeader';
import classRequest from '@/libs/requests/classRequest';

const cacheClassFetcher = cache(classRequest.getDetail);

export async function generateMetadata({ params }: { params: { classId: string } }) {
  const { data } = await cacheClassFetcher(params.classId);

  return {
    title: data.name,
    description: 'Class detail',
  };
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: { classId: string } }) => {
  const { data } = await cacheClassFetcher(params.classId);

  return (
    <>
      <ClassesHeader data={data} />
      <div className="max-w-[85%] mx-auto w-full px-4 py-6">{children}</div>
    </>
  );
};

export default Layout;
