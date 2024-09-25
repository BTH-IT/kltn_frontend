'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ISemester } from '@/types/semester';
import { CreateSemesterProvider } from '@/contexts/CreateSemesterContext';
import CreateSemesterModal from '@/components/modals/CreateSemesterModal';

import { columns } from './columns';

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
        <div className="flex items-start justify-between">
          <Heading title={`Semesters (${semesters.length})`} description="Manage semesters" />
          <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={semesters} />
        <CreateSemesterModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setSemesterCreated={setSemesterCreated} />
      </CreateSemesterProvider>
    </>
  );
};
