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
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  if (!course) {
    redirect('/');
  }

  return (
    <>
      <CourseHeader data={course} />
      <div className="max-w-[85%] mx-auto w-full px-4 py-6 course-step-5">{children}</div>
    </>
  );
};

export default Layout;
