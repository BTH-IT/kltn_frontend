'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { IUser } from '@/types';

import { columns } from './columns';

export const UserClient = ({ data }: { data: IUser[] }) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <Heading title={`Users (${data.length})`} description="Manage users" />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
