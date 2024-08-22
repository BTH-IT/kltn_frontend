/* eslint-disable no-unused-vars */
'use client';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import EditSubjectModal from '@/components/modals/EditSubjectModal';
import { ISemester } from '@/types/semester';
import EditSemesterModal from '@/components/modals/EditSemesterModel';

interface CellActionProps {
  data: ISemester;
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
      <EditSemesterModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} semester={data} />
    </>
  );
};
