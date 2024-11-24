'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ICourse } from '@/types';
import CreateCourseModal from '@/components/modals/CreateCourseModal';

import { columns } from './columns';

export const CourseClient = ({ data }: { data: ICourse[] }) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Courses (${data.length})`} description="Manage courses" />
        <CreateCourseModal>
          <Button className="text-xs md:text-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </CreateCourseModal>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
