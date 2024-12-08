/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use client';

import React, { useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArchiveRestore, ArchiveX, Settings, Trash2, Menu } from 'lucide-react';

import { CourseContext } from '@/contexts/CourseContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CourseOptionModal from '@/components/modals/CourseOptionModal';
import CommonModal from '@/components/modals/CommonModal';
import courseService from '@/services/courseService';
import { KEY_LOCALSTORAGE } from '@/utils';
import { ICourse, IUser } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CourseHeader = ({ data }: { data: ICourse }) => {
  const pathname = usePathname().replace(/\/$/, '');
  const router = useRouter();
  const newPath = pathname.slice(pathname.lastIndexOf('/'));

  const [user, setUser] = useState<IUser | null>(null);
  const [onOpenModal, setOnOpenModal] = useState(false);
  const { setCourse, course } = useContext(CourseContext);

  const [isArchiveModalOpen, setArchiveModalOpen] = useState(false);
  const [isUnarchiveModalOpen, setUnarchiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!course && data) {
      setCourse(data);
    }

    const currentUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null') as IUser;

    setUser(currentUser);
  }, [course]);

  const handleArchiveCourse = useCallback(async () => {
    try {
      await courseService.archive(data.courseId);
      setArchiveModalOpen(false);
      toast.success('Lưu trữ lớp học thành công!');
      router.refresh();
    } catch (error) {
      toast.error('Không thể lưu trữ lớp học.');
    }
  }, [data.courseId, router]);

  const handleUnarchiveCourse = useCallback(async () => {
    try {
      await courseService.unarchive(data.courseId);
      setUnarchiveModalOpen(false);
      toast.success('Bỏ lưu trữ lớp học thành công!');
      router.refresh();
    } catch (error) {
      toast.error('Không thể bỏ lưu trữ lớp học.');
    }
  }, [data.courseId, router]);

  const handleDeleteCourse = useCallback(async () => {
    try {
      await courseService.deleteCourse(data.courseId);
      setDeleteModalOpen(false);
      toast.success('Xóa lớp học thành công!');
      router.refresh();
    } catch (error) {
      toast.error('Không thể xóa lớp học.');
    }
  }, [data.courseId, router]);

  return (
    <>
      <div className="sticky top-0 right-0 bg-white z-10 border-t-[1px] flex items-center justify-between px-6 border-b w-full course-step-4">
        {/* Dropdown Menu for Mobile */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2 text-primaryGray hover:bg-slate-100">
              <Menu size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link
                  href={`/courses/${course?.courseId}`}
                  className={`${
                    newPath === `/${course?.courseId}` ? 'text-blue-600' : ''
                  } block px-2 py-1 text-sm text-primaryGray font-medium`}
                >
                  Bảng tin
                </Link>
              </DropdownMenuItem>
              {user?.id === course?.lecturerId && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/courses/${course?.courseId}/people`}
                    className={`${
                      newPath === '/people'
                        ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                        : ''
                    } block px-2 py-1 text-sm text-primaryGray font-medium`}
                  >
                    Danh sách sinh viên
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href={`/courses/${course?.courseId}/assignments`}
                  className={`${
                    newPath === '/assignments'
                      ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                      : ''
                  } block px-2 py-1 text-sm text-primaryGray font-medium`}
                >
                  Bài tập
                </Link>
              </DropdownMenuItem>
              {course?.setting.hasFinalScore && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/courses/${course?.courseId}/projects`}
                    className={`${
                      newPath === '/projects'
                        ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                        : ''
                    } block px-2 py-1 text-sm text-primaryGray font-medium`}
                  >
                    Đồ án / tiểu luận
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href={`/courses/${course?.courseId}/scores`}
                  className={`${
                    newPath === '/scores'
                      ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                      : ''
                  } block px-2 py-1 text-sm text-primaryGray font-medium hover:bg-slate-100`}
                >
                  Điểm
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Full Links for Desktop */}
        <div className="items-center hidden lg:flex">
          <Link
            href={`/courses/${course?.courseId}`}
            className={`${
              newPath === `/${course?.courseId}`
                ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                : 'text-primaryGray border-transparent'
            } px-6 py-3 text-sm  font-medium hover:bg-slate-50 transition-all duration-200`}
          >
            Bảng tin
          </Link>
          {user?.id === course?.lecturerId && (
            <Link
              href={`/courses/${course?.courseId}/people`}
              className={`${
                newPath === '/people'
                  ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                  : 'text-primaryGray border-transparent'
              } px-6 py-3 text-sm text-primaryGray font-medium hover:bg-slate-50 transition-all duration-200`}
            >
              Danh sách sinh viên
            </Link>
          )}
          <Link
            href={`/courses/${course?.courseId}/assignments`}
            className={`${
              newPath === '/assignments'
                ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                : 'text-primaryGray border-transparent'
            } px-6 py-3 text-sm text-primaryGray font-medium hover:bg-slate-50 transition-all duration-200`}
          >
            Bài tập
          </Link>
          {course?.setting.hasFinalScore && (
            <Link
              href={`/courses/${course?.courseId}/projects`}
              className={`${
                newPath === '/projects'
                  ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                  : 'text-primaryGray border-transparent'
              } px-6 py-3 text-sm text-primaryGray font-medium hover:bg-slate-50 transition-all duration-200`}
            >
              Đồ án / tiểu luận
            </Link>
          )}
          <Link
            href={`/courses/${course?.courseId}/scores`}
            className={`${
              newPath === '/scores'
                ? 'after:border-t-4 after:rounded-t-md after:bottom-0 after:h-0 after:left-0 after:absolute after:border-blue-600 !text-blue-600 after:right-0 relative'
                : 'text-primaryGray border-transparent'
            } px-6 py-3 text-sm text-primaryGray font-medium hover:bg-slate-50 transition-all duration-200`}
          >
            Điểm
          </Link>
        </div>

        {/* Action Buttons */}
        <TooltipProvider>
          <div className="flex items-center gap-4">
            {user?.id === course?.lecturerId && (
              <>
                {!course?.saveAt ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger>
                        <Settings onClick={() => setOnOpenModal(true)} />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Chỉnh sửa cài đặt lớp học</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <ArchiveRestore onClick={() => setArchiveModalOpen(true)} />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Lưu trữ lớp học</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <ArchiveX onClick={() => setUnarchiveModalOpen(true)} />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Hủy lưu trữ lớp học</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger>
                    <Trash2 onClick={() => setDeleteModalOpen(true)} />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Xóa lớp học</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
          </div>
        </TooltipProvider>
      </div>

      <CourseOptionModal onOpenModal={onOpenModal} setOnOpenModal={setOnOpenModal} />

      <CommonModal
        isOpen={isArchiveModalOpen}
        setIsOpen={setArchiveModalOpen}
        width={500}
        height={150}
        title="Bạn có chắc muốn lưu trữ lớp học không?"
        acceptTitle="Xác nhận"
        acceptClassName="hover:bg-blue-50 text-blue-600 transition-all duration-400"
        ocClickAccept={handleArchiveCourse}
      />

      <CommonModal
        isOpen={isUnarchiveModalOpen}
        setIsOpen={setUnarchiveModalOpen}
        width={500}
        height={150}
        title="Bạn có chắc muốn hủy lưu trữ lớp học không?"
        acceptTitle="Xác nhận"
        acceptClassName="hover:bg-blue-50 text-blue-600 transition-all duration-400"
        ocClickAccept={handleUnarchiveCourse}
      />

      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        width={500}
        height={150}
        title="Bạn có chắc muốn xóa lớp học không?"
        acceptTitle="Xóa"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={handleDeleteCourse}
      />
    </>
  );
};

export default CourseHeader;
