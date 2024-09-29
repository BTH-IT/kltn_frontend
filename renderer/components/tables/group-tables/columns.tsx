'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';
import { IGroup } from '@/types/group';

import { CellAction } from './cell-action';
import { CellSwitch } from './cell-swtich';

export const columns: ColumnDef<IGroup>[] = createColumns([
  {
    accessorKey: 'groupName',
    header: 'Tên nhóm',
  },
  {
    accessorKey: 'numberOfMembers',
    header: 'Tổng số thành viên',
    sortable: true,
  },
  {
    id: 'APPROVED',
    header: 'Trạng thái',
    cell: ({ row }: any) => <CellSwitch data={row.original} />,
  },
  {
    id: 'ACTION',
    header: 'Hành động',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
