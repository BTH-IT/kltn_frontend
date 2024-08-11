'use client';

import { ColumnDef } from '@tanstack/react-table';

import { IUser } from '@/types';
import { createColumns } from '@/libs/utils';

import { CellAction } from './cell-action';

export const columns: ColumnDef<IUser>[] = createColumns([
  {
    accessorKey: 'userId',
    header: 'USER ID',
  },
  {
    accessorKey: 'email',
    header: 'USER EMAIL',
  },
  {
    accessorKey: 'name',
    header: 'USER NAME',
  },
  {
    accessorKey: 'roleName',
    header: 'USER ROLE',
  },
  {
    id: 'ACTION',
    header: 'ACTION',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
