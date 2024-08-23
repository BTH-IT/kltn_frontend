'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';
import { IProject } from '@/types';

import { CellAction } from './cell-action';

export const columns: ColumnDef<IProject>[] = createColumns([
  {
    accessorKey: 'projectId',
    header: 'PROJECT ID',
  },
  {
    accessorKey: 'title',
    header: 'PROJECT TITLE',
    sortable: true,
  },
  {
    id: 'ACTION',
    header: 'ACTION',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
