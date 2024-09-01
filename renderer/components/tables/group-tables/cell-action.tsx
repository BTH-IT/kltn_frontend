'use client';

import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import CommonModal from '@/components/modals/CommonModal';
import { IGroup } from '@/types/group';
import groupService from '@/services/groupService';
import { EditGroupModal } from '@/components/modals/EditGroupModal';
import { useGroupContext } from '@/contexts/GroupContext';

interface CellActionProps {
  data: IGroup;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { groups, setGroups } = useGroupContext();
  const handleRemove = async () => {
    try {
      await groupService.deleteGroup(data.groupId);
      let updatedGroups = groups.filter((c) => c.groupId != data.groupId);
      setGroups(updatedGroups);
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
      <EditGroupModal isOpen={editModalOpen} setIsOpen={setEditModalOpen} group={data} />
      <CommonModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        width={400}
        height={150}
        title="Bạn có muốn xoá nhóm này không?"
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
