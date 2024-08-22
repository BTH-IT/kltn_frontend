'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';

import { CellAction } from './cell-action';
import { ISemester } from '@/types/semester';

export const columns: ColumnDef<ISemester>[] = createColumns([
  {
    accessorKey: 'semesterId',
    header: 'SUBJECT CODE',
  },
  {
    accessorKey: 'name',
    header: 'SUBJECT NAME',
    sortable: true,
  },
  {
    accessorKey: 'startDate',
    header: 'START DATE',
    sortable: true,
    hideable: true,
  },
  {
    accessorKey: 'endDate',
    header: 'END DATE',
    sortable: true,
    hideable: true,
  },
  {
    id: 'ACTION',
    header: 'ACTION',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
