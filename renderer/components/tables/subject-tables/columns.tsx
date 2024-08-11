'use client';

import { ColumnDef } from '@tanstack/react-table';

import { ISubject } from '@/types';
import { createColumns } from '@/libs/utils';

import { CellAction } from './cell-action';

export const columns: ColumnDef<ISubject>[] = createColumns([
  {
    accessorKey: 'subjectId',
    header: 'SUBJECT ID',
    maxSize: 1,
  },
  {
    accessorKey: 'name',
    header: 'SUBJECT NAME',
    maxSize: 250,
  },
  {
    id: 'ACTION',
    header: 'ACTION',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
