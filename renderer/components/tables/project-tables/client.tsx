'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { IProject } from '@/types';
import CreateProjectModal from '@/components/modals/CreateProjectModal';
import { CreateProjectContext } from '@/contexts/CreateProjectContext';

import { columns } from './columns';

export const ProjectClient = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectCreated, setProjectCreated] = useState<IProject | null>(null);
  const { projects, setProjects } = useContext(CreateProjectContext);

  useEffect(() => {
    if (projectCreated) {
      setProjects([...projects, projectCreated]);
    }
  }, [projectCreated]);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Đề tài" description="Quản lý các đề tài" />
        <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={projects} />
      <CreateProjectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setProjectCreated={setProjectCreated} />
    </>
  );
};
