import { Suspense } from 'react';
import { Info, Pencil } from 'lucide-react';
import { cookies } from 'next/headers';

import AnnouncementInput from '@/components/common/AnnouncementInput';
import Loading from '@/components/loading/loading';
import InviteCode from '@/components/pages/courses/InviteCode';
import { API_URL } from '@/constants/endpoints';
import { ICourse } from '@/types';
import http from '@/libs/http';
import { Button } from '@/components/ui/button';
import CoursePersonalizeModal from '@/components/modals/CoursePersonalizeModal';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const {
    payload: { data: course },
  } = await http.get<ICourse>(`${API_URL.COURSES}/${params.courseId}`);

  const bgImageStyles = {
    backgroundImage: `url(${course.background || 'https://gstatic.com/classroom/themes/img_backtoschool.jpg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  const cookieStore = cookies();
  const userCookie = cookieStore.get('user')?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;

  return (
    <Suspense fallback={<Loading />}>
      <section>
        <div className={'overflow-hidden relative w-full rounded-lg h-[240px]'} style={bgImageStyles}>
          <div className="absolute w-full h-full bg-custom-radial-gradient"></div>
          <div className="absolute flex flex-col w-full gap-2 text-white bottom-4 left-4">
            <h2 className="text-3xl font-bold">{course.courseGroup}</h2>
            <p className="text-xl font-medium">
              {course.subjectId} - {course.subjectName}
            </p>
          </div>
          {user?.id === course.lecturerId && (
            <CoursePersonalizeModal data={course}>
              <Button
                variant="ghost"
                className="flex absolute top-4 right-4 gap-3 items-center py-1 px-3 text-[16px] text-blue-500 bg-white"
              >
                <Pencil width={18} height={18} />
                <span>Tùy chỉnh</span>
              </Button>
            </CoursePersonalizeModal>
          )}
          <Info
            className="absolute right-4 bottom-4 flex-col p-2 text-white rounded-full transition-all hover:bg-[rgba(0, 0, 0, 0.8)] cursor-pointer"
            width={36}
            height={36}
          />
        </div>
        <div className="grid grid-cols-12 gap-6 mt-10">
          <div className="flex flex-col col-span-3 gap-4">
            <InviteCode inviteCode={course.inviteCode} teacherId={course.lecturerId} name={course.courseGroup} />
            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2>Sắp đến hạn</h2>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-xs text-gray-400">Không có bài tập nào sắp đến hạn</p>
              </div>
              <div className="flex justify-end">
                <button className="p-2 text-sm rounded-md hover:bg-slate-100">Xem tất cả</button>
              </div>
            </div>
          </div>
          <div className="col-span-9">
            <AnnouncementInput course={course} />
          </div>
        </div>
      </section>
    </Suspense>
  );
}
