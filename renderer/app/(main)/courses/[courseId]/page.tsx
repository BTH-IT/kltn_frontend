import { Suspense } from 'react';
import { cookies } from 'next/headers';

import Loading from '@/components/loading/loading';
import { API_URL } from '@/constants/endpoints';
import { ICourse } from '@/types';
import http from '@/libs/http';
import { KEY_LOCALSTORAGE } from '@/utils';
import Newsletter from '@/components/pages/courses/Newsletter';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  const cookieStore = cookies();
  const userCookie = cookieStore.get(KEY_LOCALSTORAGE.CURRENT_USER)?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;

  return (
    <Suspense fallback={<Loading />}>
      <Newsletter course={course} user={user} />
    </Suspense>
  );
}
