'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { IGroup } from '@/types/group';
import { Separator } from '@/components/ui/separator';
import { CreateGroupModal } from '@/components/modals/CreateGroupModal';
import { useGroupContext } from '@/contexts/GroupContext';
import { ICourse, IUser } from '@/types';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

import { columns } from './columns';
import { userColumns } from './user-columns';

const GroupClient = ({ user, course }: { user: IUser | null; course: ICourse | null }) => {
  const { groups, setGroups } = useGroupContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupCreated, setGroupCreated] = useState<IGroup | null>(null);

  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!course) return;

    const breadcrumbLabel = course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel, href: `/courses/${course.courseId}` },
      { label: 'Nhóm' },
    ]);
  }, [course, setItems]);
  useEffect(() => {
    if (groupCreated) {
      setGroups((prev) => [...prev, groupCreated]);
    }
  }, [groupCreated, setGroups]);

  return (
    <>
      {/* <div className="flex items-start justify-between">
        <Heading title="Nhóm" description="Quản lý các nhóm" />
        <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable columns={user?.id === course?.lecturerId ? columns : userColumns} data={groups} />
      <CreateGroupModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setGroupCreated={setGroupCreated} /> */}
    </>
  );
};
export default GroupClient;
