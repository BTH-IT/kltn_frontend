import { Suspense } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

import Loading from '@/components/loading/loading';
import CreateCourseModal from '@/components/modals/CreateCourseModal';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/common/CourseCard';
import JoinClassModal from '@/components/modals/JoinClassModal';
import { API_URL } from '@/constants/endpoints';
import { getUserFromCookie } from '@/libs/actions';
import http from '@/libs/http';
import { ICourse } from '@/types';
import { revalidate } from '@/libs/utils';

const HomePage = async () => {
  const [user, coursesResponse] = await Promise.all([
    getUserFromCookie(),
    http.get<{
      createdCourses: ICourse[];
      enrolledCourses: ICourse[];
    }>(`${API_URL.ACCOUNTS}${API_URL.COURSES}`, {
      next: { revalidate: revalidate },
    }) as Promise<any>,
  ]);

  const courses = coursesResponse.payload?.data;

  if (!user) {
    return redirect('/login');
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        {courses?.createdCourses?.length === 0 && courses?.enrolledCourses?.length === 0 ? (
          <div className="flex pt-32">
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <Image src="/images/empty_states_home.png" alt="Illustration" width={200} height={50} priority />
                  <p className="mb-4">Thêm một lớp học để bắt đầu</p>
                  <CreateCourseModal>
                    <Button variant="secondary2" className="px-4 py-2 mr-2">
                      Tạo lớp học
                    </Button>
                  </CreateCourseModal>
                  <JoinClassModal>
                    <Button variant="primary" className="px-4 py-2">
                      Tham gia lớp học
                    </Button>
                  </JoinClassModal>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 p-6">
            {[...courses.createdCourses, ...courses.enrolledCourses].map((item) => (
              <CourseCard key={item.courseId} item={item} />
            ))}
          </div>
        )}
      </Suspense>
    </>
  );
};

export default HomePage;
