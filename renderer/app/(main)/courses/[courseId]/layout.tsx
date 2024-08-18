import React from 'react';

import ClassesHeader from '@/components/pages/classes/ClassesHeader';
import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ICourse } from '@/types';

export async function generateMetadata({ params }: { params: { courseId: string } }) {
  const { payload: course } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  return {
    title: course.courseGroup,
    description: 'Class detail',
  };
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string } }) => {
  const { payload: course } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  return (
    <>
      <ClassesHeader data={course} />
      <div className="max-w-[85%] mx-auto w-full px-4 py-6">{children}</div>
    </>
  );
};

export default Layout;
