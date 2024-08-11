/* eslint-disable no-unused-vars */
'use client';
import React, { useState } from 'react';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IUser } from '@/types';
import EditUserModal from '@/components/modals/EditUserModal';

interface CellActionProps {
  data: IUser;
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
      <EditUserModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} user={data} />
    </>
  );
};
