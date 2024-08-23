/* eslint-disable no-unused-vars */
'use client';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { IProject } from '@/types/project';
import EditprojectModal from '@/components/modals/EditProjectModal';

interface CellActionProps {
  data: IProject;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  return (
    <>
      <div className="flex items-center justify-center w-14">
        <Edit className="w-5 h-5 cursor-pointer" onClick={() => setEditModalOpen(true)} />
      </div>
      <EditprojectModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} project={data} />
    </>
  );
};
