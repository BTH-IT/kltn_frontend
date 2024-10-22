'use client';

import React, { useContext, useEffect, useState } from 'react';
import { BarChart2, FileText, Users } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import CreateProjectModal from '@/components/modals/CreateProjectModal';
import { CreateProjectContext } from '@/contexts/CreateProjectContext';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import { CourseContext } from '@/contexts/CourseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IProject, IUser } from '@/types';
import { useGroupContext } from '@/contexts/GroupContext';

import { userColumns } from '../group-tables/user-columns';
import { columns } from '../group-tables/columns';

import { columns as projectColumns } from './columns';

export const ProjectClient = ({ user }: { user: IUser | null }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectCreated, setProjectCreated] = useState<IProject | null>(null);
  const { projects, setProjects } = useContext(CreateProjectContext);
  const { course } = useContext(CourseContext);
  const { groups } = useGroupContext();
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
    if (projectCreated) {
      setProjects([...projects, projectCreated]);
    }
  }, [projectCreated]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Đồ án / tiểu luận" description="Quản lý đồ án / tiểu luận" />
        {/* <Button
          className='text-xs md:text-sm'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' /> Thêm mới
        </Button> */}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng số đồ án</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{1}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng số nhóm</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{2}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Số thành viên chưa có nhóm</CardTitle>
            <BarChart2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{3}</div>
          </CardContent>
        </Card>
      </div>

      <Separator />
      <CreateProjectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setProjectCreated={setProjectCreated} />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="projects">Đồ án</TabsTrigger>
          <TabsTrigger value="groups">Nhóm</TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <DataTable columns={projectColumns} data={projects} />
        </TabsContent>
        <TabsContent value="groups">
          <DataTable columns={user?.id === course?.lecturerId ? columns : userColumns} data={groups} />
        </TabsContent>
      </Tabs>
    </>
  );
};
