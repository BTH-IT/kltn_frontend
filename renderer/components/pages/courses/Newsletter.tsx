'use client';

import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { Pencil } from 'lucide-react';

import CoursePersonalizeModal from '@/components/modals/CoursePersonalizeModal';
import { Button } from '@/components/ui/button';
import { ICourse, IUser } from '@/types';
import AnnouncementInput from '@/components/common/AnnouncementInput';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

import InviteCode from './InviteCode';

const Newsletter = ({ course, user }: { course: ICourse; user: IUser }) => {
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    const breadcrumbLabel = course.name;

    setItems([{ label: 'Lớp học', href: '/' }, { label: breadcrumbLabel }]);
  }, [course, setItems]);

  return (
    <section>
      <div className="relative w-full rounded-lg h-[240px] overflow-hidden">
        <Image
          src={course.background || 'https://gstatic.com/classroom/themes/img_backtoschool.jpg'}
          alt="Course background"
          layout="fill"
          objectFit="cover"
        />

        {user?.id === course.lecturerId && !course.saveAt && (
          <div className="absolute top-2 right-2" style={{ zIndex: 3 }}>
            <CoursePersonalizeModal data={course}>
              <Button
                variant="ghost"
                className="flex items-center gap-2 py-1.5 px-3 text-base bg-white hover:bg-white/90 text-blue-500"
              >
                <Pencil className="w-4 h-4" />
                <span>Tùy chỉnh</span>
              </Button>
            </CoursePersonalizeModal>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/90 z-2"></div>

        <div className="absolute inset-x-0 bottom-0 p-6 text-white z-3">
          <div className="max-w-4xl">
            <h2 className="mb-2 text-3xl font-bold leading-tight line-clamp-2 shadow-text">{course.name}</h2>
            <p className="mb-1 text-xl font-medium shadow-text">
              {course.subject?.subjectCode && <span className="mr-2">{course.subject.subjectCode}</span>}
              {course.subject?.name && <span>{course.subject.name}</span>}
            </p>
            {course.semester && <p className="text-sm font-normal shadow-text">Niên khóa: {course.semester}</p>}{' '}
          </div>
        </div>
      </div>
      {!course?.saveAt && (
        <>
          {user?.id === course.lecturerId && course?.enableInvite ? (
            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="flex flex-col w-full col-span-12 gap-4 xl:col-span-3">
                <InviteCode course={course} teacherId={course.lecturerId} name={course.name} user={user} />
              </div>
              <div className="col-span-12 xl:col-span-9">
                <AnnouncementInput course={course} />
              </div>
            </div>
          ) : (
            <div className="w-full mt-10">
              <AnnouncementInput course={course} />
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Newsletter;
