/* eslint-disable no-unused-vars */
'use client';
import { Delete, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import EditSubjectModal from '@/components/modals/EditSubjectModal';
import { ISubject } from '@/types';
import CommonModal from '@/components/modals/CommonModal';
import { logError } from '@/libs/utils';
import subjectService from '@/services/subjectService';

interface CellActionProps {
  data: ISubject;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();

  const handleRemove = async (id: string) => {
    try {
      await subjectService.deleteSubject(id);
      router.refresh();
    } catch (error) {
      logError(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-14">
        <Edit className="w-5 h-5 cursor-pointer" onClick={() => setEditModalOpen(true)} />
        <Delete className="w-5 h-5 text-red-500 cursor-pointer" onClick={() => setDeleteModal(true)} />
      </div>
      <EditSubjectModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} subject={data} />
      <CommonModal
        isOpen={deleteModal}
        setIsOpen={setDeleteModal}
        width={400}
        height={150}
        title="Bạn có muốn môn học này không?"
        acceptTitle="Xoá"
        acceptClassName="hover:bg-red-50 text-red-600 transition-all duration-400"
        ocClickAccept={async () => {
          await handleRemove(data.subjectId);
          setDeleteModal(false);
        }}
      />
    </>
  );
};
