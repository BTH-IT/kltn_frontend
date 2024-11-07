'use client';

import { ColumnDef } from '@tanstack/react-table';

import { createColumns } from '@/libs/utils';
import { IGroup } from '@/types/group';
import { IGroupMember } from '@/types/group-member';

import { CellJoin } from './cell-join';

export const userColumns: ColumnDef<IGroup>[] = createColumns([
  {
    accessorKey: 'groupName',
    header: 'Tên nhóm',
  },
  {
    id: 'Members',
    header: 'Thành viên',
    cell: ({ row }: any) => (
      <span>
        {row.original.groupMembers.length}/{row.original.numberOfMembers}
      </span>
    ),
  },
  {
    id: 'Leader',
    header: 'Nhóm trưởng',
    cell: ({ row }: any) => {
      const leader = row.original.groupMembers.find((g: IGroupMember) => g.isLeader);
      return <span>{leader?.studentObj?.fullName || leader?.studentObj?.userName || 'Chưa có nhóm trưởng'}</span>;
    },
  },
  {
    id: 'JOIN',
    header: 'Hành động',
    cell: ({ row }: any) => (
      <div className="flex justify-start">
        <CellJoin data={row.original} />
      </div>
    ),
  },
]);
