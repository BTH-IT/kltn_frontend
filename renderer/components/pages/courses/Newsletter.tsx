'use client';

import { useContext, useEffect } from 'react';
import { Pencil } from 'lucide-react';

import CoursePersonalizeModal from '@/components/modals/CoursePersonalizeModal';
import { Button } from '@/components/ui/button';
import { ICourse, IUser } from '@/types';
import AnnouncementInput from '@/components/common/AnnouncementInput';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

import InviteCode from './InviteCode';

const Newsletter = ({ course, user }: { course: ICourse; user: IUser }) => {
  const { setItems } = useContext(BreadcrumbContext);

  const bgImageStyles = {
    backgroundImage: `url(${course.background || 'https://gstatic.com/classroom/themes/img_backtoschool.jpg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };

  useEffect(() => {
    const breadcrumbLabel = course.name;

    setItems([{ label: 'Lớp học', href: '/' }, { label: breadcrumbLabel }]);
  }, [course, setItems]);

  return (
    <section>
      <div className={'overflow-hidden relative w-full rounded-lg h-[240px]'} style={bgImageStyles}>
        <div className="absolute w-full h-full bg-custom-radial-gradient"></div>
        <div className="absolute flex flex-col w-full gap-2 text-white bottom-4 left-4">
          <h2 className="text-3xl font-bold">{course.name}</h2>
          <p className="text-xl font-medium">
            {course.subject?.subjectCode} - {course.subject?.name}
          </p>
          <p className="text-sm font-normal">Niên khóa: {course.semester}</p>
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
        {/* <Info
      className='absolute right-4 bottom-4 flex-col p-2 text-white rounded-full transition-all hover:bg-[rgba(0, 0, 0, 0.8)] cursor-pointer'
      width={36}
      height={36}
    /> */}
      </div>
      {user?.id === course.lecturerId ? (
        <div className="grid grid-cols-12 gap-6 mt-10">
          <div className="flex flex-col col-span-3 gap-4">
            <InviteCode course={course} teacherId={course.lecturerId} name={course.name} user={user} />
          </div>
          <div className="col-span-9">
            <AnnouncementInput course={course} />
          </div>
        </div>
      ) : (
        <div className="w-full mt-10">
          <AnnouncementInput course={course} />
        </div>
      )}
    </section>
  );
};

export default Newsletter;
