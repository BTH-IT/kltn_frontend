'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const GroupHeader = ({ data }: { data: any }) => {
  const pathname = usePathname().replace(/\/$/, '');

  const newPath = pathname.slice(pathname.lastIndexOf('/'));

  return (
    <div className="sticky top-0 right-0 z-10 flex items-center justify-between gap-3 mb-6 bg-white border-b">
      <div className="flex items-center">
        <Link
          href={`/groups/${data.courseId}/${data.groupId}`}
          className={`${
            newPath === `/${data.groupId}`
              ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
              : ''
          } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
        >
          Thông tin chung
        </Link>
        <Link
          href={`/groups/${data.courseId}/${data.groupId}/boards`}
          className={`${
            newPath === '/boards'
              ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
              : ''
          } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
        >
          Bảng
        </Link>
        <Link
          href={`/groups/${data.courseId}/${data.groupId}/gantts`}
          className={`${
            newPath === '/gantts'
              ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
              : ''
          } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
        >
          Gantt
        </Link>
        <Link
          href={`/groups/${data.courseId}/${data.groupId}/calendars`}
          className={`${
            newPath === '/calendars'
              ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
              : ''
          } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
        >
          Lịch
        </Link>
      </div>
    </div>
  );
};

export default GroupHeader;
