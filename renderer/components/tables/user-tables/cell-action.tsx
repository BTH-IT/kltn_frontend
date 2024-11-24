/* eslint-disable no-unused-vars */
'use client';
import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { IUser } from '@/types';
import EditUserModal from '@/components/modals/EditUserModal';

interface CellActionProps {
  data: IUser;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center w-14">
        <Edit className="w-5 h-5 cursor-pointer" onClick={() => setEditModalOpen(true)} />
      </div>
      <EditUserModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} user={data} />
    </>
  );
};
