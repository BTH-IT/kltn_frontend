import { Suspense } from 'react';
import Image from 'next/image';

import Loading from '@/components/loading/loading';
import { ICourse } from '@/types';
import CourseCard from '@/components/common/CourseCard';
import { API_URL } from '@/constants/endpoints';
import http from '@/libs/http';

const ArchivesPage = async () => {
  const {
    payload: {
      data: { archivedCourses },
    },
  } = await http.get<{
    archivedCourses: ICourse[];
  }>(`${API_URL.ACCOUNTS}${API_URL.COURSES}/saved`);

  return (
    <>
      <Suspense fallback={<Loading />}>
        {archivedCourses.length == 0 ? (
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
                  <p className="mb-4">Không có lớp học lưu trữ nào!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 p-6">
            {archivedCourses.map((item) => (
              <CourseCard key={item.courseId} item={item} />
            ))}
          </div>
        )}
      </Suspense>
    </>
  );
};

export default ArchivesPage;
