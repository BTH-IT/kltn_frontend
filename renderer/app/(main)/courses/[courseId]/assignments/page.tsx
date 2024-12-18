/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import AssignmentHmWorkModal from '@/components/modals/AssigmentHmWorkModal';
import { IAssignment } from '@/types/assignment';
import { CourseContext } from '@/contexts/CourseContext';
import { KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';
import AssignmentList from '@/components/pages/courses/assignment/AssignmentList';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

const AssignmentPage = () => {
  const { course } = useContext(CourseContext);
  const { setItems } = useContext(BreadcrumbContext);

  const [onOpenAssignModal, setOnOpenAssignModal] = useState(false);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!course) return;

    const breadcrumbLabel = course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel, href: `/courses/${course.courseId}` },
      { label: 'Bài tập' },
    ]);
  }, [course, setItems]);

  useEffect(() => {
    setIsMounted(true);
    if (course) {
      setAssignments(course.assignments.filter((assign) => assign.type?.toLowerCase() !== 'final'));
    }
  }, [course, user]);

  console.log(assignments);

  return (
    <div className="assignments-step-1">
      {isMounted && (
        <>
          {user?.id === course?.lecturerId && !course?.saveAt && (
            <div
              onClick={() => setOnOpenAssignModal(true)}
              className="inline-flex gap-2 w-[100px] items-center cursor-pointer px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-3xl"
            >
              <Plus />
              <span>Tạo</span>
            </div>
          )}
          {assignments?.length > 0 ? (
            <AssignmentList
              assignments={assignments}
              setAssignments={setAssignments}
              isTeacher={user?.id === course?.lecturerId}
            />
          ) : (
            <div className="flex flex-col gap-2 justify-center items-center mt-[135px] text-primaryGray">
              <Image
                src="/images/no_assigments.svg"
                width={2000}
                height={1000}
                className="w-[250px] h-[150px]"
                alt="no-assigments"
              />
              <h2 className="font-semibold">Đây là nơi giao bài tập</h2>
              <p className="max-w-[70%] text-center">
                Bạn có thể thêm bài tập và các công việc khác cho lớp rồi sắp xếp thành các chủ đề
              </p>
            </div>
          )}
          <AssignmentHmWorkModal
            course={course}
            onOpenModal={onOpenAssignModal}
            setOnOpenModal={setOnOpenAssignModal}
            setAssignments={setAssignments}
          />
        </>
      )}
    </div>
  );
};

export default AssignmentPage;
