'use client';

import { EllipsisVertical, UserRoundPlus, ChevronDown, ArrowDownAZ, BookUser } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AvatarHeader from '@/components/common/AvatarHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ICourse, IUser } from '@/types';
import InviteStudentModal from '@/components/modals/InviteStudentModal';
import CommonModal from '@/components/modals/CommonModal';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, logError, sortUsersByName } from '@/libs/utils';
import { useCheckedState, PersonState } from '@/libs/hooks/useCheckState';
import courseService from '@/services/courseService';
import { KEY_LOCALSTORAGE } from '@/utils';
import ImportStudentModal from '@/components/modals/ImportStudentModal';

const People = ({ isTeacher = true, data, course }: { isTeacher?: boolean; data: IUser[]; course: ICourse }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteManyModalOpen, setIsDeleteManyModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [list, setList] = useState<IUser[]>([]);
  const [selectedRemove, setSelectedRemove] = useState<IUser | null>(null);
  const [selectedRemoveMany, setSelectedRemoveMany] = useState<IUser[]>([]);
  const [sortAscending, setSortAscending] = useState(false);

  const [user, setUser] = useState<IUser | null>(null);

  const router = useRouter();

  const {
    checkedState,
    handleAllCheckedChange,
    handleIndividualCheckedChange,
    allChecked,
    indeterminate,
    setCheckedState,
  } = useCheckedState([]);

  useEffect(() => {
    setList(data);
    setCheckedState(
      data.map((user) => ({
        userId: user.id,
        email: user.email,
        checked: false,
      })),
    );

    const user = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null') as IUser;

    setUser(user);
  }, [data, setCheckedState]);

  const handleRemove = async (id: string) => {
    try {
      await courseService.deleteStudentOfCourse(String(course.courseId), id);
      const newList = list.filter((item) => item.id !== id);
      setList(newList);
      toast.success('Xoá sinh viên thành công');
    } catch (error) {
      logError(error);
    }
  };

  return (
    <section className={(cn('flex flex-col gap-3 mx-auto max-w-[800px]'), isTeacher ? 'mb-10' : '')}>
      <div className="flex items-center justify-between gap-3 py-2 border-b">
        <h2 className="text-3xl">{isTeacher ? 'Giáo viên' : 'Sinh viên'}</h2>
        <div className="flex items-center justify-end gap-3">
          {!isTeacher && (
            <>
              <p className="text-sm font-semibold text-primaryGray">{list.length} sinh viên</p>
              {user?.id === course.lecturerId && !course.saveAt && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            setIsInviteModalOpen(true);
                          }}
                          variant="outline"
                          className="rounded-full border-none flex justify-center items-center !w-[48px] !h-[48px] !p-1"
                        >
                          <UserRoundPlus />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Thêm sinh viên thủ công</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() => {
                            setIsImportModalOpen(true);
                          }}
                          variant="outline"
                          className="rounded-full border-none flex justify-center items-center !w-[48px] !h-[48px] !p-1"
                        >
                          <BookUser />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Thêm sinh viên qua excel</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {!isTeacher && list.length > 0 && user?.id === course.lecturerId && !course.saveAt && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-5">
            <Checkbox
              checked={allChecked ? true : indeterminate ? 'indeterminate' : false}
              onCheckedChange={handleAllCheckedChange}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button disabled={!allChecked && !indeterminate} variant="primaryReverge">
                  <span>Thao tác</span>
                  <ChevronDown className="ml-1" width={16} height={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      const emails = checkedState
                        .filter((item: PersonState) => item.checked)
                        .map((item: PersonState) => item.email)
                        .join(';');

                      router.push(`https://mail.google.com/mail/u/0/?fs=1&to=${emails}&tf=cm`);
                    }}
                  >
                    Gửi email cho học viên
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setIsDeleteManyModalOpen(true);
                      // get list of user that checked and set to selectedRemoveMany
                      setSelectedRemoveMany(
                        checkedState
                          .filter((item: PersonState) => item.checked)
                          .map((item: PersonState) => list.find((user) => user.id === item.userId))
                          .filter(Boolean) as IUser[],
                      );
                    }}
                  >
                    Xóa
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-none flex justify-center items-center !w-[48px] !h-[48px] !p-1"
            onClick={() => {
              setList(sortUsersByName(list, sortAscending));
              setSortAscending(!sortAscending);
            }}
          >
            <ArrowDownAZ />
          </Button>
        </div>
      )}
      {list.map((d, idx) => (
        <AvatarHeader
          key={idx}
          imageUrl={d?.avatar || '/images/avt.png'}
          name={d?.fullName || d?.userName || 'anonymous'}
          type={isTeacher ? 'teacher' : 'student'}
          dropdownMenu={
            <>
              {user?.id === course.lecturerId && user?.id !== d.id && !course.saveAt && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="cursor-pointer">
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-auto" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push(`https://mail.google.com/mail/u/0/?fs=1&to=${d?.email}&tf=cm`)}
                      >
                        Gửi email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedRemove(d);
                        }}
                      >
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          }
          showCheckbox={user?.id === course.lecturerId}
          checked={!!checkedState.find((item: PersonState) => item.userId === d.id)?.checked}
          onCheckedChange={() => handleIndividualCheckedChange(d.id)}
        />
      ))}
      <InviteStudentModal isOpen={isInviteModalOpen} setIsOpen={setIsInviteModalOpen} course={course} />
      <ImportStudentModal isOpen={isImportModalOpen} setIsOpen={setIsImportModalOpen} course={course} />
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={400}
        height={150}
        title="Bạn có muốn xoá sinh viên này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          if (selectedRemove) {
            await handleRemove(selectedRemove.id);
          }

          setIsDeleteModalOpen(false);
        }}
      />
      <CommonModal
        isOpen={isDeleteManyModalOpen}
        setIsOpen={setIsDeleteManyModalOpen}
        width={500}
        height={400}
        title="Bạn có muốn xoá các sinh viên này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          if (selectedRemoveMany) {
            await courseService.deleteStudentsOfCourse(
              course.courseId,
              selectedRemoveMany.map((item) => item.id),
            );
          }
          setIsDeleteManyModalOpen(false);
        }}
        desc={
          <div className="overflow-y-auto max-h-[250px]">
            {selectedRemoveMany.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-2">
                <Image
                  src={item.avatar || '/images/avt.png'}
                  height={3000}
                  width={3000}
                  alt="avatar"
                  className="w-[35px] h-[35px] rounded-full"
                />
                <span className="font-sans font-medium line-clamp-1">{item.fullName + ` (${item.email})`}</span>
              </div>
            ))}
          </div>
        }
      />
    </section>
  );
};

export default People;
