/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BookText, EllipsisVertical, NotebookText } from 'lucide-react';
import moment from 'moment';
import Link from 'next/link';

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
import { useToast } from '@/components/ui/use-toast';
import { IAssignment } from '@/types/assignment';

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
  const [showButton, setShowButton] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { toast } = useToast();

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
      toast({
        title: 'Đã sao chép link bài tập',
        variant: 'done',
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowButton(!isDropdownOpen);
  };

  return (
    <AccordionItem
      className="accordion-container relative rounded-2xl border-t-[0.5px] border-x-[0.5px] overflow-hidden data-[state=open]:shadow-xl"
      value={assignment.assignmentId}
    >
      <AccordionTriggerNoIcon>
        <div
          className={cn(
            'flex items-center justify-between w-full rounded-t-xl pl-5 pr-16 h-16 border-b-[0.5px] hover:border-0 hover:bg-gray-100',
          )}
          onMouseEnter={() => !isDropdownOpen && setShowButton(true)}
          onMouseLeave={() => !isDropdownOpen && setShowButton(false)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-full">{icon}</div>
            <div>{assignment.title}</div>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-500">
              {assignment.dueDate
                ? `Đến hạn vào ${formatVNDate(assignment.dueDate)}`
                : isTeacher
                  ? `Đã đăng ${moment(assignment.createdAt).fromNow()}`
                  : 'Không có ngày đến hạn'}
            </div>
          </div>
          <div className={cn('button-container absolute top-0 translate-y-[18%] right-2', !showButton && 'opacity-0')}>
            <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdown}>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button
                  variant="primaryGhost"
                  className="h-12 p-3 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
                  onClick={(event) => event.stopPropagation()}
                >
                  <EllipsisVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center gap-3 p-2 text-md">Chỉnh sửa</DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-3 p-2 text-md">Xóa</DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-3 p-2 text-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLinkClick();
                    }}
                  >
                    Sao chép đường liên kết
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </AccordionTriggerNoIcon>
      <AccordionContent>
        <div className="min-h-40 max-h-[342px] overflow-auto py-5">
          <div className="flex flex-col gap-4 pb-5 pl-5 pr-8">
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                {`Đã đăng vào ${formatVNDate(assignment.createdAt, false)} ${
                  assignment.updatedAt != assignment.createdAt ? `(Đã chỉnh sửa ${assignment.updatedAt})` : ''
                }`}
              </div>
              <div className="text-green-600">Đã giao</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: assignment.content }} />
            <AnnouncementAttachList links={assignment.attachedLinks} files={assignment.attachments} />
          </div>
          <div className="pt-5 px-3 border-t-[1px]">
            <Link
              href={`/courses/${assignment.courseId}/assignments/${assignment.assignmentId}`}
              className="p-3 font-medium text-center text-blue-600 transition-all duration-300 ease-in-out rounded-md hover:text-blue-800 hover:bg-blue-100/30"
            >
              {type === 'document' ? 'Xem tài liệu' : 'Xem Hướng dẫn'}
            </Link>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AssignmentAccordion;
