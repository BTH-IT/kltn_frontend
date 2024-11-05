'use client';
import React, { useContext, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

import { IGroup } from '@/types';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

import { DataTable } from '../ui/data-table';
import { userColumns } from '../tables/group-tables/user-columns';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const StudentGroup = ({ group, groups }: { group: IGroup | null; groups: IGroup[] }) => {
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!group) return;

    const breadcrumbLabel = group.course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel, href: `/groups/${group.courseId}` },
      { label: 'Đồ án / tiểu luận' },
    ]);
  }, [group, setItems]);

  return (
    <>
      {!group && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Chú ý</AlertTitle>
          <AlertDescription>Bạn chưa có nhóm. Vui lòng tham gia một nhóm để bắt đầu làm đồ án.</AlertDescription>
        </Alert>
      )}
      <DataTable columns={userColumns} data={groups} isSearchable={false} />
    </>
  );
};

export default StudentGroup;
