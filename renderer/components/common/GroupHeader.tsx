'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Menu } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

const GroupHeader = ({ data }: { data: any }) => {
  const pathname = usePathname().replace(/\/$/, '');

  const newPath = pathname.slice(pathname.lastIndexOf('/'));

  return (
    <div className="sticky top-[1.2px] right-0 z-10 flex items-center justify-between gap-3 mb-6 bg-white border-b">
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 text-primaryGray hover:bg-slate-100">
            <Menu size={24} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
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
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/groups/${data.courseId}/${data.groupId}/submit`}
                className={`${
                  newPath === '/submit'
                    ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                    : ''
                } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
              >
                Nộp đồ án / tiểu luận
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/groups/${data.courseId}/${data.groupId}/reports`}
                className={`${
                  newPath === '/reports'
                    ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
                    : ''
                } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
              >
                Báo cáo tiến độ
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="items-center hidden lg:flex">
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
          href={`/groups/${data.courseId}/${data.groupId}/submit`}
          className={`${
            newPath === '/submit'
              ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
              : ''
          } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
        >
          Nộp đồ án / tiểu luận
        </Link>
        <Link
          href={`/groups/${data.courseId}/${data.groupId}/reports`}
          className={`${
            newPath === '/reports'
              ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0'
              : ''
          } px-6 h-12 leading-[48px] text-sm relative text-primaryGray font-medium hover:bg-slate-100`}
        >
          Báo cáo tiến độ
        </Link>
      </div>
    </div>
  );
};

export default GroupHeader;
