/* eslint-disable max-len */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';

import { CourseContext } from '@/contexts/CourseContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CourseOptionModal from '@/components/modals/CourseOptionModal';
import { KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';

const CourseHeader = ({ data }: { data: any }) => {
  const pathname = usePathname().replace(/\/$/, '');

  const newPath = pathname.slice(pathname.lastIndexOf('/'));

  const [user, setUser] = useState<IUser | null>(null);

  const [onOpenModal, setOnOpenModal] = useState(false);

  const { setCourse } = useContext(CourseContext);

  useEffect(() => {
    if (data) {
      setCourse(data);
    }
    const user = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}') as IUser;
    setUser(user);
  }, [data, setCourse]);

  return (
    <>
      <div className="sticky top-0 right-0 bg-white z-10 border-t-[1px] flex gap-3 justify-between items-center px-6 border-b">
        <div className="flex items-center">
          <Link
            href={`/courses/${data.courseId}`}
            className={`${
              newPath === `/${data.courseId}`
                ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                : ''
            } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
          >
            Bảng tin
          </Link>
          <Link
            href={`/courses/${data.courseId}/people`}
            className={`${
              newPath === '/people'
                ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                : ''
            } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
          >
            Mọi người
          </Link>
          {user?.id === data.lecturerId && (
            <Link
              href={`/courses/${data.courseId}/projects`}
              className={`${
                newPath === '/projects'
                  ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                  : ''
              } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
            >
              Đề tài
            </Link>
          )}
          <Link
            href={`/courses/${data.courseId}/groups`}
            className={`${
              newPath === '/groups'
                ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                : ''
            } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
          >
            Nhóm
          </Link>
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-4">
            {user?.id === data.lecturerId && (
              <>
                <Tooltip>
                  <TooltipTrigger>
                    <Settings onClick={() => setOnOpenModal(true)} />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Cài đặt lớp học</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TooltipProvider>
      </div>

      <CourseOptionModal onOpenModal={onOpenModal} setOnOpenModal={setOnOpenModal} />
    </>
  );
};

export default CourseHeader;
