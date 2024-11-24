'use client';

import { ColumnDef } from '@tanstack/react-table';

import { ICourse } from '@/types';
import { createColumns } from '@/libs/utils';

export const columns: ColumnDef<ICourse>[] = createColumns([
  {
    accessorKey: 'courseId',
    header: 'Mã lớp học',
  },
  {
    accessorKey: 'courseGroup',
    header: 'Tên lớp học',
    sortable: true,
  },
  {
    accessorKey: 'inviteCode',
    header: 'Mã mời vào lớp học',
    sortable: true,
  },
  {
    accessorKey: 'semester',
    header: 'Học kì',
    sortable: true,
  },
]);
