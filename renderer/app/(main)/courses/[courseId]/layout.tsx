import React from 'react';
import { redirect } from 'next/navigation';

import http from '@/libs/http';
import { API_URL } from '@/constants/endpoints';
import { ICourse } from '@/types';
import CourseHeader from '@/components/pages/courses/CourseHeader';
import { revalidate } from '@/libs/utils';

export async function generateMetadata({ params }: { params: { courseId: string } }) {
  const { payload } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  return {
    title: payload.data.name,
    description: 'Class detail',
  };
}

const Layout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string } }) => {
  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`, {
    next: { revalidate: revalidate },
  });

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
