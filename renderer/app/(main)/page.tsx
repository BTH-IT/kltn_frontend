import { Suspense } from 'react';
import Image from 'next/image';

import { fetcher } from '@/actions';
import Loading from '@/components/loading/loading';
import CreateClassModal from '@/components/modals/CreateClassModal';
import JoinClassModal from '@/components/modals/JoinClassModal';
import { API_URL } from '@/constants/endpoints';
import ClassCard from '@/components/common/ClassCard';
import { Button } from '@/components/ui/button';

const HomePage = async () => {
  const {
    data: { classesCreated, classesEnrolled },
  } = await fetcher<any>(`${API_URL.CLASSES}/user/1`);

  const classData = [...classesCreated, ...classesEnrolled];

  return (
    <>
      <Suspense fallback={<Loading />}>
        {classesCreated.length == 0 && classesEnrolled.length == 0 ? (
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
            {classData.map((item) => (
              <ClassCard key={item.classId} item={item} />
            ))}
          </div>
        )}
      </Suspense>
    </>
  );
};

export default HomePage;
