/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AlignLeft, BookText, FileQuestion, NotebookText, NotepadText, Plus, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClassContext } from '@/contexts/ClassContext';
import AssignmentHmWorkModal from '@/components/modals/AssigmentHmWorkModal';
import AssignmentDocsModal from '@/components/modals/AssignmentDocsModal';
import AssignmentTestModal from '@/components/modals/AssigmentTestModal';
import AssignmentList from '@/components/pages/classes/assignment/AssignmentList';
import Loading from '@/components/loading/loading';
import { IAssignment } from '@/types';
import assignmentService from '@/services/assignmentService';
import { cn } from '@/libs/utils';

const AssignmentPage = () => {
  const { classes } = useContext(ClassContext);

  const [onOpenAssignModal, setOnOpenAssignModal] = useState(false);
  const [onOpenTestModal, setOnOpenTestModal] = useState(false);
  const [onOpenDocsModal, setOnOpenDocsModal] = useState(false);
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (classes && user) {
          if (user?.id === classes.teacherId) {
            setAssignments(classes.assignments);
          } else {
            const res = await assignmentService.getAssignmentsByUserId(classes.classId, user?.id);
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
  }, [classes, user]);

  console.log(assignments);

  return (
    <>
      {isMounted && (
        <div>
          <div className={cn('pb-10', assignments?.length === 0 && 'border-b border-b-[#e0e0e0]')}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="inline-flex gap-2 w-[100px] items-center px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-3xl">
                  <Plus />
                  <span>Tạo</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="flex gap-3 p-2 items-center text-md"
                    onClick={() => setOnOpenAssignModal(true)}
                  >
                    <NotebookText />
                    Bài tập
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-3 p-2 items-center text-md"
                    onClick={() => setOnOpenTestModal(true)}
                  >
                    <NotepadText />
                    Bài kiểm tra
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem className="flex gap-3 p-2 items-center text-md">
              <FileQuestion />
              Câu hỏi
            </DropdownMenuItem> */}
                  <DropdownMenuItem
                    className="flex gap-3 p-2 items-center text-md"
                    onClick={() => setOnOpenDocsModal(true)}
                  >
                    <BookText />
                    Tài liệu
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex gap-3 p-2 items-center text-md">
                    <RefreshCcw />
                    Sử dụng lại bài đăng
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {assignments?.length > 0 ? (
            <AssignmentList
              assignments={assignments}
              setAssignments={setAssignments}
              isTeacher={user?.id === classes?.teacherId}
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
            classes={classes}
            onOpenModal={onOpenAssignModal}
            setOnOpenModal={setOnOpenAssignModal}
            setAssignments={setAssignments}
          />
          <AssignmentTestModal
            classes={classes}
            onOpenModal={onOpenTestModal}
            setOnOpenModal={setOnOpenTestModal}
            setAssignments={setAssignments}
          />
          <AssignmentDocsModal
            classes={classes}
            onOpenModal={onOpenDocsModal}
            setOnOpenModal={setOnOpenDocsModal}
            setAssignments={setAssignments}
          />
        </div>
      )}
    </>
  );
};

export default AssignmentPage;
