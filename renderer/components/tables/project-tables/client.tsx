/* eslint-disable no-unused-vars */
'use client';

import { BarChart2, FileText, Plus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import CreateProjectModal from '@/components/modals/CreateProjectModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import { CourseContext } from '@/contexts/CourseContext';
import { CreateProjectContext } from '@/contexts/CreateProjectContext';
import { useGroupContext } from '@/contexts/GroupContext';
import courseService from '@/services/courseService';
import { IGroup, IProject, IUser } from '@/types';

import { columns as groupColumns } from '../group-tables/columns';
import { userColumns as groupUserColumns } from '../group-tables/user-columns';

import { columns as projectColumns } from './columns';
import { userColumns as projectUserColumns } from './user-columns';

export const ProjectClient = ({ user }: { user: IUser | null }) => {
  const router = useRouter();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [projectCreated, setProjectCreated] = useState<IProject | null>(null);
  const [groupCreated, setGroupCreated] = useState<IGroup | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [currentGroup, setCurrentGroup] = useState<IGroup | null>(null);
  const { projects } = useContext(CreateProjectContext);
  const { course } = useContext(CourseContext);
  const { groups, setGroups } = useGroupContext();

  const [activeTab, setActiveTab] = useState('projects');

  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!course) return;

    const breadcrumbLabel = course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel, href: `/courses/${course.courseId}` },
      { label: 'Đồ án / tiểu luận' },
    ]);
  }, [course, setItems]);

  useEffect(() => {
    if (groupCreated) {
      setGroups([...groups, groupCreated]);
    }
  }, [groupCreated]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!course) return;

      const res = await courseService.getStats(course.courseId);
      setStats(res.data);
    };

    fetchStats();
  }, [course]);

  useEffect(() => {
    if (course && user && groups.length > 0 && course.lecturerId !== user.id) {
      const currentGroup = groups.find((group) => group.groupMembers?.some((member) => member.studentId === user.id));
      currentGroup && setCurrentGroup(currentGroup);
    }
  }, [course, user, groups]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Đồ án / tiểu luận" description="Quản lý đồ án / tiểu luận" />
      </div>

      {user?.id === course?.lecturerId && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tổng số đồ án</CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.numberOfProjects || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Tổng số nhóm</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.numberOfGroups || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Số thành viên chưa tham gia nhóm</CardTitle>
              <BarChart2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.numberOfUngroupStudents || 0}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Separator className="my-3" />

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        setIsOpen={setIsProjectModalOpen}
        setProjectCreated={setProjectCreated}
      />
      <CreateGroupModal
        isOpen={isGroupModalOpen}
        setIsOpen={setIsGroupModalOpen}
        setGroupCreated={setGroupCreated}
        minNumberOfMembers={course?.setting.minGroupSize || 1}
        maxNumberOfMembers={course?.setting.maxGroupSize || 15}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="projects">Quản lý các đồ án</TabsTrigger>
          <TabsTrigger
            onClick={() => {
              currentGroup && router.push(`/groups/${course?.courseId}/${currentGroup.groupId}`);
            }}
            value="groups"
          >
            Quản lý các nhóm
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          {user?.id === course?.lecturerId ? (
            <DataTable
              columns={user?.id === course?.lecturerId ? projectColumns : projectUserColumns}
              data={projects}
              isProject
              button={
                <Button className="text-xs md:text-sm" onClick={() => setIsProjectModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Thêm đồ án mới
                </Button>
              }
            />
          ) : course?.setting.allowStudentCreateProject ? (
            <DataTable
              columns={user?.id === course?.lecturerId ? projectColumns : projectUserColumns}
              data={projects}
              isProject
              button={
                <Button className="text-xs md:text-sm" onClick={() => setIsProjectModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Đăng ký
                </Button>
              }
            />
          ) : (
            <DataTable
              columns={user?.id === course?.lecturerId ? projectColumns : projectUserColumns}
              data={projects}
            />
          )}
        </TabsContent>
        <TabsContent value="groups">
          {!currentGroup && (
            <>
              {user?.id === course?.lecturerId ? (
                <DataTable
                  columns={user?.id === course?.lecturerId ? groupColumns : groupUserColumns}
                  data={groups}
                  isProject
                  button={
                    <Button className="text-xs md:text-sm" onClick={() => setIsGroupModalOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Thêm nhóm mới
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
        </TabsContent>
      </Tabs>
    </>
  );
};
