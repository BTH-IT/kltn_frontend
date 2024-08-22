'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ISubject } from '@/types';
import CreateSubjectModal from '@/components/modals/CreateSubjectModal';

import { columns } from './columns';
import { CreateSubjectProvider } from '@/contexts/CreateSubjectContext';

export const SubjectClient = ({ data }: { data: ISubject[] }) => {
  const [subjects, setSubjects] = useState<ISubject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectCreated, setSubjectCreated] = useState<ISubject | null>(null);

  useEffect(() => {
    setSubjects(data);
    if (subjectCreated) {
      setSubjects((prev) => [...prev, subjectCreated]);
    }
  }, [subjectCreated, data]);

  return (
    <>
      <CreateSubjectProvider>
        <div className="flex justify-between items-start">
          <Heading title={`Subjects (${subjects.length})`} description="Manage subjects" />
          <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 w-4 h-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={subjects} />
        <CreateSubjectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setSubjectCreated={setSubjectCreated} />
      </CreateSubjectProvider>
    </>
  );
};
