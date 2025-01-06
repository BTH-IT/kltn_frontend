'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';
import { IGroup } from '@/types/group';

import { CellAction } from './cell-action';

export const columns: ColumnDef<IGroup>[] = createColumns([
  {
    accessorKey: 'groupName',
    header: 'Tên nhóm',
  },
  {
    accessorKey: 'MEMBER',
    header: 'Thành viên',
    cell: ({ row }: any) => (
      <div>
        {row.original.groupMembers.length} / {row.original.numberOfMembers}
      </div>
    ),
  },
  {
    id: 'APPROVED',
    header: 'Trạng thái',
    sortable: true,
    cell: ({ row }) => <span>{row.original.isApproved ? 'Đã chấp thuận' : 'Chưa chấp thuận'}</span>,
  },
  {
    id: 'ACTION',
    header: 'Hành động',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
