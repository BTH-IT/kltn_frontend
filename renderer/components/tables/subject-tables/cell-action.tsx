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
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center w-14">
        <Edit className="w-5 h-5 cursor-pointer" onClick={() => setEditModalOpen(true)} />
      </div>
      <EditSubjectModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} subject={data} />
    </>
  );
};
