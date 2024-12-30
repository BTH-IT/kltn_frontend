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
  const { groups, setGroups } = useGroupContext();
  const { course } = useContext(CourseContext);
  const { setItems } = useContext(BreadcrumbContext);

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<IGroup | null>(null);
  const [unGroupedStudents, setUnGroupedStudents] = useState<number>(0);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');
    if (storedUser) setUser(storedUser);
    else router.push('/login');
  }, [router]);

  useEffect(() => {
    if (assignment && course) {
      setItems([
        { label: 'Lớp học', href: '/' },
        { label: course.name, href: `/courses/${course.courseId}` },
        { label: assignment.title },
      ]);
    }
  }, [assignment, course, setItems]);

  useEffect(() => {
    if (assignment && course) {
      const studentGroupedNumber = groups.reduce((acc, group) => acc + (group.groupMembers?.length || 0), 0);
      setUnGroupedStudents(course.students.length - studentGroupedNumber);
    }
  }, [assignment, course, groups]);

  useEffect(() => {
    if (course && user && groups.length > 0) {
      const currentGroup = groups.find((group) => group.groupMembers?.some((member) => member.studentId === user.id));
      if (currentGroup) {
        setCurrentGroup(currentGroup);
      } else if (course.lecturerId !== user.id) {
        const userGroup = groups.find((group) => group.groupMembers?.some((member) => member.studentId === user.id));
        if (userGroup) {
          router.push(`/courses/${course.courseId}/assignments/${assignment.assignmentId}/groups/${userGroup.groupId}`);
        }
      }
    }
  }, [assignment, user, groups, course, router]);

  const renderCards = () => (
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
  );

  const renderDataTable = () => (
    <DataTable
      columns={user && course && user.id === course.lecturerId ? groupColumns : groupUserColumns}
      data={groups}
      isProject
      button={
        course && user && (course?.lecturerId === user?.id || course?.setting.allowGroupRegistration) ? (
          <Button className="text-xs md:text-sm" onClick={() => setIsGroupModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />{' '}
            {course && user && course.lecturerId === user.id ? 'Tạo nhóm bài tập mới' : 'Đăng ký'}
          </Button>
        ) : null
      }
    />
  );

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <Heading
          title={`Bài tập: ${assignment.title}`}
          description={assignment.createUser?.id === user?.id ? 'Quản lý nhóm bài tập' : 'Đăng kí nhóm bài tập'}
        />
        <ArrowLeftFromLine
          className="w-8 h-8 cursor-pointer text-primaryGray"
          onClick={() => router.push(`/courses/${course?.courseId}/assignments/${assignment.assignmentId}`)}
        />
      </div>

      {course && user && user.id === course.lecturerId && (
        <>
          {renderCards()}
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

      <section className="mt-5">{!currentGroup && renderDataTable()}</section>
    </>
  );
};
