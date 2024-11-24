'use client';

import { ColumnDef } from '@tanstack/react-table';

import { IUser } from '@/types';
import { createColumns } from '@/libs/utils';

import { CellAction } from './cell-action';

export const columns: ColumnDef<IUser>[] = createColumns([
  {
    accessorKey: 'userId',
    header: 'Mã người dùng',
    cell: ({ row }: any) => row.original.userId || 'N/A',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: any) => row.original.email || 'N/A',
  },
  {
    accessorKey: 'userName',
    header: 'Username',
    cell: ({ row }: any) => row.original.userName || 'N/A',
  },
  {
    accessorKey: 'fullName',
    header: 'Họ và tên',
    cell: ({ row }: any) => row.original.fullName || 'Chưa cập nhật',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Số điện thoại',
    cell: ({ row }: any) => row.original.phoneNumber || 'Chưa cập nhật',
  },
  {
    id: 'ACTION',
    header: 'Hành động',
    cell: ({ row }: any) => <CellAction data={row.original} />,
  },
]);
