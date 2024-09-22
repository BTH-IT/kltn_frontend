/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import AssignmentHmWorkModal from '@/components/modals/AssigmentHmWorkModal';
import assignmentService from '@/services/assignmentService';
import { IAssignment } from '@/types/assignment';
import { CourseContext } from '@/contexts/CourseContext';
import { KEY_LOCALSTORAGE } from '@/utils';
import { IUser } from '@/types';
import AssignmentList from '@/components/pages/courses/assignment/AssignmentList';

const AssignmentPage = () => {
  const { course } = useContext(CourseContext);

  const [onOpenAssignModal, setOnOpenAssignModal] = useState(false);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (course && user) {
          if (user?.id === course.lecturerId) {
            setAssignments([]);
          } else {
            const res = await assignmentService.getAssignmentsByUserId(course.courseId, user?.id);
            if (res.data) {
              setAssignments(res.data);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching assignments: ', error);
      } finally {
        setIsMounted(true);
      }
    };

    fetchAssignments();
  }, [course, user]);

  return (
    <>
      {isMounted && (
        <>
          <div
            onClick={() => setOnOpenAssignModal(true)}
            className="inline-flex gap-2 w-[100px] items-center cursor-pointer px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-3xl"
          >
            <Plus />
            <span>Tạo</span>
          </div>
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
    </>
  );
};

export default AssignmentPage;
