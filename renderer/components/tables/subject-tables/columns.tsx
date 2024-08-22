'use client';

import { ColumnDef } from '@tanstack/react-table';

import { ISubject } from '@/types';
import { createColumns } from '@/libs/utils';

import { CellAction } from './cell-action';

export const columns: ColumnDef<ISubject>[] = createColumns([
  {
    accessorKey: 'subjectCode',
    header: 'SUBJECT CODE',
  },
  {
    accessorKey: 'name',
    header: 'SUBJECT NAME',
    sortable: true,
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION',
    sortable: true,
    hideable: true,
  },
  {
    id: 'ACTION',
    header: 'ACTION',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
