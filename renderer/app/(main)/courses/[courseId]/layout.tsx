import React from 'react';
import { redirect } from 'next/navigation';

import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ICourse } from '@/types';
import CourseHeader from '@/components/pages/courses/CourseHeader';

export async function generateMetadata({ params }: { params: any }) {
  const { payload } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  return {
    title: payload.data.name,
    description: 'Course detail',
  };
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: any }) => {
  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  if (!course) {
    redirect('/');
  }

  return (
    <>
      <CourseHeader data={course} />
      <div className="max-w-[85%] mx-auto w-full px-4 py-6">{children}</div>
    </>
  );
};

export default Layout;
