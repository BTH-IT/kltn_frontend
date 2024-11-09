/* eslint-disable no-unused-vars */
'use client';

import { ArrowLeftFromLine, BarChart2, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { CreateAssignmentGroupModal } from '@/components/modals/CreateAssignmentGroupModal';
import { columns as groupColumns } from '@/components/tables/assignment-group-tables/columns';
import { userColumns as groupUserColumns } from '@/components/tables/assignment-group-tables/user-columns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import { CourseContext } from '@/contexts/CourseContext';
import { useGroupContext } from '@/contexts/GroupContext';
import { IAssignment, IGroup, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

export const AssignmentGroupList = ({ assignment }: { assignment: IAssignment }) => {
  const router = useRouter();

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<IGroup | null>(null);
  const [unGroupedStudents, setUnGroupedStudents] = useState<number>(0);
  const { groups, setGroups } = useGroupContext();
  const [user, setUser] = useState<IUser | null>(null);
  const { course } = useContext(CourseContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!assignment || !course) return;

    const breadcrumbLabel = course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      {
        label: breadcrumbLabel,
        href: `/courses/${course.courseId}`,
      },
      { label: assignment.title },
    ]);
  }, [assignment, course, setItems]);

  useEffect(() => {
    if (!assignment || !course) return;
    const studentGroupedNumber = groups.reduce((acc, group) => {
      return group.groupMembers ? acc + group.groupMembers.length : acc;
    }, 0);

    setUnGroupedStudents(course?.students.length - studentGroupedNumber);
  }, [assignment, course, groups]);

  useEffect(() => {
    if (course && user && groups.length > 0 && course.lecturerId !== user.id) {
      const currentGroup = groups.find((group) => group.groupMembers?.some((member) => member.studentId === user.id));
      currentGroup && setCurrentGroup(currentGroup);
    }

    const isUserInGroup = groups.find((group) => group.groupMembers?.some((member) => member.studentId === user?.id));
    if (isUserInGroup) {
      router.push(
        `/courses/${course?.courseId}/assignments/${assignment.assignmentId}/groups/${isUserInGroup?.groupId}`,
      );
      return;
    }
  }, [assignment, user, groups, course]);

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <Heading
          title={`Bài tập: ${assignment.title}`}
          description={assignment.createUser?.id === user?.id ? 'Quản lý nhóm bài tập' : 'Đăng kí nhóm bài tập'}
        />
        <ArrowLeftFromLine
          className="w-8 h-8 cursor-pointer text-primaryGray"
          onClick={() => {
            router.push(`/courses/${course?.courseId}/assignments/${assignment.assignmentId}`);
          }}
        />
      </div>

      {user?.id === course?.lecturerId && (
        <>
          <div className="grid gap-4 mb-5 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Tổng số nhóm</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{groups.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Số thành viên chưa tham gia nhóm</CardTitle>
                <BarChart2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unGroupedStudents}</div>
              </CardContent>
            </Card>
          </div>
          <Separator />
          <CreateAssignmentGroupModal
            isOpen={isGroupModalOpen}
            setIsOpen={setIsGroupModalOpen}
            minNumberOfMembers={course?.setting.minGroupSize || 1}
            maxNumberOfMembers={course?.setting.maxGroupSize || 15}
            assignment={assignment}
            setGroups={setGroups}
          />
        </>
      )}

      <section className="mt-5">
        {!currentGroup && (
          <>
            {user?.id === course?.lecturerId ? (
              <DataTable
                columns={user?.id === course?.lecturerId ? groupColumns : groupUserColumns}
                data={groups}
                isProject
                button={
                  <Button className="text-xs md:text-sm" onClick={() => setIsGroupModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Tạo nhóm bài tập mới
                  </Button>
                }
              />
            ) : course?.setting.allowGroupRegistration ? (
              <DataTable
                columns={user?.id === course?.lecturerId ? groupColumns : groupUserColumns}
                data={groups}
                isProject
                button={
                  <Button className="text-xs md:text-sm" onClick={() => setIsGroupModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Đăng ký
                  </Button>
                }
              />
            ) : (
              <DataTable columns={user?.id === course?.lecturerId ? groupColumns : groupUserColumns} data={groups} />
            )}
          </>
        )}
      </section>
    </>
  );
};
