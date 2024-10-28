/* eslint-disable no-unused-vars */
'use client';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { IProject } from '@/types/project';
import EditProjectModal from '@/components/modals/EditProjectModal';
import CommonModal from '@/components/modals/CommonModal';
import projectService from '@/services/projectService';

interface CellActionProps {
  data: IProject;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    try {
      await projectService.deleteProject(data.projectId);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center gap-3 w-14">
        <Edit className="w-5 h-5 cursor-pointer" onClick={() => setEditModalOpen(true)} />
        <Trash2 className="w-5 h-5 cursor-pointer" onClick={() => setIsDeleteModalOpen(true)} />
      </div>
      <EditProjectModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} project={data} />
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={400}
        height={150}
        title="Bạn có muốn xoá đồ án này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleRemove();
          setIsDeleteModalOpen(false);
        }}
      />
    </>
  );
};
