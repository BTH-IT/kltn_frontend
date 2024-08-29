'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';
import { IGroup } from '@/types/group';
import { CellAction } from './cell-action';
import { CellSwitch } from './cell-swtich';
import { CellGoto } from './cell-goto';

export const columns: ColumnDef<IGroup>[] = createColumns([
  {
    accessorKey: 'groupName',
    header: 'GROUP NAME',
  },
  {
    accessorKey: 'numberOfMembers',
    header: 'TOTAL MEMBERS',
    sortable: true,
  },
  {
    id: 'APPROVED',
    header: 'APPROVED',
    cell: ({ row }: any) => <CellSwitch data={row.original} />,
  },
  {
    id: 'ACTION',
    header: 'ACTION',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
  {
    id: 'VIEW',
    header: 'VIEW',
    cell: ({ row }: any) => <CellGoto data={row.original} />,
  },
]);
