'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { columns } from './columns';
import { ISemester } from '@/types/semester';
import { CreateSemesterProvider } from '@/contexts/CreateSemesterContext';
import CreateSemesterModal from '@/components/modals/CreateSemesterModal';

export const SemesterClient = ({ data }: { data: ISemester[] }) => {
  const [semesters, setSemesters] = useState<ISemester[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [semesterCreated, setSemesterCreated] = useState<ISemester | null>(null);

  useEffect(() => {
    setSemesters(data);
    if (semesterCreated) {
      setSemesters((prev) => [...prev, semesterCreated]);
    }
  }, [semesterCreated, data]);

  return (
    <>
      <CreateSemesterProvider>
        <div className="flex justify-between items-start">
          <Heading title={`Semesters (${semesters.length})`} description="Manage semesters" />
          <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 w-4 h-4" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={semesters} />
        <CreateSemesterModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setSemesterCreated={setSemesterCreated} />
      </CreateSemesterProvider>
    </>
  );
};
