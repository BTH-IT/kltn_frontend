'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';

import Loading from '@/components/loading/loading';
import withPermission from '@/libs/hoc/withPermission';
import CreateClassModal from '@/components/modals/CreateClassModal';
import { Button } from '@/components/ui/button';
import { ICourse } from '@/types';
import courseService from '@/services/courseService';
import CourseCard from '@/components/common/CourseCard';
import JoinClassModal from '@/components/modals/JoinClassModal';

const HomePage = async () => {
  const [coursesCreated, setCoursesCreated] = useState<ICourse[]>([]);
  const [coursesEnrolled, setCoursesEnrolled] = useState<ICourse[]>([]);

  useEffect(() => {
    const fetchCoursesCreated = async () => {
      const res = await courseService.getCourses();

      setCoursesCreated(res);
    };

    const fetchCoursesEnrolled = async () => {
      const res = await courseService.getCourses();

      setCoursesEnrolled(res);
    };

    // fetchCoursesCreated();
    // fetchCoursesEnrolled();
  }, []);

  return (
    <>
      <Suspense fallback={<Loading />}>
        {coursesCreated.length == 0 && coursesEnrolled.length == 0 ? (
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
                    <CreateClassModal>
                      <Button variant="secondary2" className="px-4 py-2 mr-2">
                        Tạo lớp học
                      </Button>
                    </CreateClassModal>
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
            {[...coursesCreated, ...coursesEnrolled].map((item) => (
              <CourseCard key={item.courseId} item={item} />
            ))}
          </div>
        )}
      </Suspense>
    </>
  );
};

export default withPermission(HomePage);
