'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ICourse } from '@/types';

import { columns } from './columns';

export const CourseClient = ({ data }: { data: ICourse[] }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Lớp học (${data.length})`} description="Xem thông tin lớp học" />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
