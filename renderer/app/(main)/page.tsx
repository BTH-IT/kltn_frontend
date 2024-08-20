import { Suspense } from 'react';
import Image from 'next/image';

import Loading from '@/components/loading/loading';
import CreateCourseModal from '@/components/modals/CreateCourseModal';
import { Button } from '@/components/ui/button';
import { ICourse } from '@/types';
import CourseCard from '@/components/common/CourseCard';
import JoinClassModal from '@/components/modals/JoinClassModal';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';

const HomePage = async () => {
  const {
    payload: { data: courses },
  } = await http.get<{
    createdCourses: ICourse[];
    enrolledCourses: ICourse[];
  }>(`${API_URL.ACCOUNTS}${API_URL.COURSES}`);

  return (
    <>
      <Suspense fallback={<Loading />}>
        {courses.createdCourses.length == 0 && courses.enrolledCourses.length == 0 ? (
          <div className="flex pt-32">
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-center flex-1">
                <div className="text-center">
                  <Image
                    src="/images/empty_states_home.png"
                    alt="Illustration"
                    className="mx-auto mb-4"
                    width={200}
                    height={50}
                  />
                  <p className="mb-4">Thêm một lớp học để bắt đầu</p>
                  <div>
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
