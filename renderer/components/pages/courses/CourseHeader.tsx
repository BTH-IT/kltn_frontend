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
            href={`/courses/${data.courseId}/assignments`}
            className={`${
              pathname.includes(`/courses/${data.courseId}/assignments`)
                ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                : ''
            } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
          >
            Bài tập trên lớp
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
            <>
              <Link
                href={`/courses/${data.courseId}/score`}
                className={`${
                  newPath === '/score'
                    ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                    : ''
                } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
              >
                Điểm
              </Link>
              <Link
                href={`/courses/${data.courseId}/attendance`}
                className={`${
                  newPath === '/attendance'
                    ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                    : ''
                } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
              >
                Điểm danh
              </Link>
            </>
          )}
        </div>
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1_4)">
                    <path
                      d="M14.35 2.5H9.65C8.94 2.5 8.28 2.88 7.92 3.49L1.58 14.4C1.22 15.02 1.22 15.78 1.57 16.4L3.92 20.49C4.28 21.11 4.94 21.49 5.65 21.49H18.33C19.05 21.49 19.71 21.11 20.06 20.49L22.41 16.4C22.77 15.78 22.76 15.02 22.4 14.4L16.08 3.49C15.72 2.88 15.06 2.5 14.35 2.5ZM18.34 19.5H5.66L3.31 15.41L9.65 4.5H14.35L20.69 15.41L18.34 19.5ZM12.9 7.75H11.1L6.52 15.73L7.25 17H16.75L17.48 15.73L12.9 7.75ZM9.25 15L12 10.2L14.75 15H9.25Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1_4">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Thư mục của lớp học</p>
              </TooltipContent>
            </Tooltip>
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
