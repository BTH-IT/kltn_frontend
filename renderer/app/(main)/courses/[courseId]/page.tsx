import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import Loading from '@/components/loading/loading';
import { API_URL } from '@/constants/endpoints';
import { ICourse } from '@/types';
import http from '@/libs/http';
import Newsletter from '@/components/pages/courses/Newsletter';
import { getUserFromCookie } from '@/libs/actions';

export default async function CoursePage({ params }: { params: any }) {
  const [user, courseData] = await Promise.all([
    getUserFromCookie(),
    http.get<ICourse | null>(`${API_URL.COURSES}/${params.courseId}`),
  ]);

  const course = courseData.payload?.data;

  if (!course) {
    redirect('/');
  }

  return (
    <Suspense fallback={<Loading />}>
      <Newsletter course={course} user={user} />
    </Suspense>
  );
}
