'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { IProject } from '@/types';
import { CreateProjectProvider } from '@/contexts/CreateProjectContext';
import CreateProjectModal from '@/components/modals/CreateProjectModal';

import { columns } from './columns';

export const ProjectClient = ({ data }: { data: IProject[] }) => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectCreated, setProjectCreated] = useState<IProject | null>(null);

  useEffect(() => {
    setProjects(data);
    if (projectCreated) {
      setProjects((prev) => [...prev, projectCreated]);
    }
  }, [projectCreated, data]);

  return (
    <CreateProjectProvider>
      <div className="flex items-start justify-between">
        <Heading title={`Projects (${projects.length})`} description="Manage projects" />
        <Button className="text-xs md:text-sm" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={projects} />
      <CreateProjectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} setProjectCreated={setProjectCreated} />
    </CreateProjectProvider>
  );
};
