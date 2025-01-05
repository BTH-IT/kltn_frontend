'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ISubject } from '@/types';
import CreateSubjectModal from '@/components/modals/CreateSubjectModal';
import { CreateSubjectProvider } from '@/contexts/CreateSubjectContext';

import { columns } from './columns';

export const SubjectClient = ({ data }: { data: ISubject[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <CreateSubjectProvider>
        <div className="flex items-start justify-between">
          <Heading title={`Môn học (${data.length})`} description="Quản lý môn học" />
          <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Thêm mới
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={data} />
        <CreateSubjectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </CreateSubjectProvider>
    </>
  );
};
