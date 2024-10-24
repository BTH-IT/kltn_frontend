'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';
import { IProject } from '@/types';

export const userColumns: ColumnDef<IProject>[] = createColumns([
  {
    accessorKey: 'title',
    header: 'Tên đề tài',
    sortable: true,
  },
  {
    id: 'APPROVED',
    header: 'Trạng thái',
    sortable: true,
    cell: ({ row }) => <span>{row.original.isApproved ? 'Đã chấp thuận' : 'Chưa chấp thuận'}</span>,
  },
  {
    accessorKey: 'description',
    header: 'Mô tả',
  },
]);
