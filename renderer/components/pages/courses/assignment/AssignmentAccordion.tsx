/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BookText, EllipsisVertical, GraduationCap, NotebookText } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { AccordionContent, AccordionItem, AccordionTriggerNoIcon } from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { formatVNDate } from '@/utils';
import { cn } from '@/libs/utils';
import AnnouncementAttachList from '@/components/common/AnnouncementAttachList';
import { IAssignment } from '@/types/assignment';
import assignmentService from '@/services/assignmentService';
import EditAssignmentHmWorkModal from '@/components/modals/EditAssigmentHmWorkModal';
import CommonModal from '@/components/modals/CommonModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { API_URL } from '@/constants/endpoints';

const AssignmentAccordion = ({
  assignment,
  setAssignments,
  type = 'homeWork',
  isTeacher,
}: {
  assignment: IAssignment;
  setAssignments: React.Dispatch<React.SetStateAction<IAssignment[]>>;
  type?: string;
  isTeacher: boolean;
}) => {
  const [icon, setIcon] = useState<React.ReactNode>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const icons: { [key: string]: React.ReactNode } = {
      homeWork: <NotebookText className="text-white" />,
      exam: <NotebookText className="text-white" />,
      document: <BookText className="text-white" />,
    };
    setIcon(icons[type] || <NotebookText className="text-white" />);
  }, [type]);

  const handleCopyLinkClick = async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/courses/${assignment.courseId}/assignments/${assignment.assignmentId}`,
      );
      toast.success('Đã sao chép đường liên kết');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRemoveAssignment = async () => {
    try {
      const res = await assignmentService.deleteAssignment(assignment.assignmentId);
      if (res) {
        toast.success('Đã xoá bài tập thành công');
        setAssignments((prev) => prev.filter((item) => item.assignmentId !== assignment.assignmentId));
      }
    } catch (err) {
      console.error('Failed to delete assignment: ', err);
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <AccordionItem
        className="accordion-container relative rounded-2xl border-t-[0.5px] border-x-[0.5px] overflow-hidden data-[state=open]:shadow-xl"
        value={assignment.assignmentId}
      >
        <AccordionTriggerNoIcon>
          <div
            className={cn(
              'flex items-center justify-between w-full rounded-t-xl pl-5 pr-16 h-16 border-b-[0.5px] hover:border-0 hover:bg-gray-100',
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-full">{icon}</div>
              <div>{assignment.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="text-sm text-gray-500">
                  {assignment.dueDate
                    ? `Đến hạn vào ${moment(assignment.dueDate).format(
                        'l',
                      )} - ${moment(assignment.dueDate).format('LT')}`
                    : isTeacher
                      ? `Đã đăng ${moment(assignment.createdAt).fromNow()}`
                      : 'Không có ngày đến hạn'}
                </div>
              </div>
              {isTeacher && (
                <TooltipProvider>
                  <Link
                    href={`${API_URL.COURSES}/${assignment?.courseId}${API_URL.ASSIGNMENTS}/${assignment?.assignmentId}/submits`}
                  >
                    <Button variant="ghost" size="icon" className="flex items-center justify-center rounded-full">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <GraduationCap className="w-6 h-6" />
                        </TooltipTrigger>
                        <TooltipContent>Xem và chấm bài</TooltipContent>
                      </Tooltip>
                    </Button>
                  </Link>
                </TooltipProvider>
              )}
            </div>
            {!assignment.course?.saveAt && (
              <div className={cn('button-container absolute top-0 translate-y-[18%] right-2')}>
                <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdown}>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <Button
                      variant="primaryGhost"
                      className="h-12 p-3 text-gray-600 bg-transparent rounded-full hover:bg-gray-200"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto" align="end">
                    <DropdownMenuGroup>
                      {isTeacher && (
                        <>
                          <DropdownMenuItem
                            className="flex items-center gap-3 p-2 text-md"
                            onClick={(e) => {
                              setIsEditModalOpen(true);
                              e.stopPropagation();
                            }}
                          >
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-3 p-2 text-md"
                            onClick={(e) => {
                              setIsDeleteModalOpen(true);
                              e.stopPropagation();
                            }}
                          >
                            Xóa
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        className="flex items-center gap-3 p-2 text-md"
                        onClick={(e) => {
                          handleCopyLinkClick();
                          e.stopPropagation();
                        }}
                      >
                        Sao chép đường liên kết
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </AccordionTriggerNoIcon>
        <AccordionContent>
          <div className="py-5 overflow-auto min-h-40">
            <div className="flex flex-col gap-4 pb-5 pl-5 pr-8 overflow-y-auto">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  {`Đã đăng vào ${formatVNDate(assignment?.createdAt.toString(), false)} ${
                    assignment.updatedAt != assignment.createdAt && assignment.updatedAt
                      ? `(Đã chỉnh sửa  ${moment(assignment?.updatedAt).fromNow()})`
                      : ''
                  }`}
                </div>
                <div className="text-green-600">Đã giao</div>
              </div>
              <div className="markdown ql-editor" dangerouslySetInnerHTML={{ __html: assignment.content }} />
              <AnnouncementAttachList links={assignment.attachedLinks || []} files={assignment.attachments || []} />
            </div>
            <div className="pt-5 px-3 border-t-[1px]">
              <Link
                href={`/courses/${assignment.courseId}/assignments/${assignment.assignmentId}`}
                className="p-3 font-medium text-center text-blue-600 transition-all duration-300 ease-in-out rounded-md hover:text-blue-800 hover:bg-blue-100/30"
              >
                {type === 'document' ? 'Xem tài liệu' : 'Xem chi tiết'}
              </Link>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <EditAssignmentHmWorkModal
        assignment={assignment}
        onOpenModal={isEditModalOpen}
        setOnOpenModal={setIsEditModalOpen}
        setAssignments={setAssignments}
      />
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={500}
        height={150}
        title="Bạn có chắc muốn xoá bài tập này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleRemoveAssignment();
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default AssignmentAccordion;
