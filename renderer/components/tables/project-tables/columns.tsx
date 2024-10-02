'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';
import { IProject } from '@/types';

import { CellAction } from './cell-action';
import { CellSwitch } from './cell-swtich';

export const columns: ColumnDef<IProject>[] = createColumns([
  {
    accessorKey: 'title',
    header: 'Tên đề tài',
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
