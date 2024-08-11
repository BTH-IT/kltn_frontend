/* eslint-disable no-unused-vars */
'use client';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import EditSubjectModal from '@/components/modals/EditSubjectModal';
import { ISubject } from '@/types';

interface CellActionProps {
  data: ISubject;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  return (
    <>
      <div className="flex w-14 justify-center items-center">
        <Edit className="w-5 h-5 cursor-pointer" onClick={() => setEditModalOpen(true)} />
      </div>
      <EditSubjectModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} subject={data} />
    </>
  );
};
