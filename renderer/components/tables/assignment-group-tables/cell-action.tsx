'use client';

import { Edit, EyeIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import CommonModal from '@/components/modals/CommonModal';
import { EditGroupModal } from '@/components/modals/EditGroupModal';
import { useGroupContext } from '@/contexts/GroupContext';
import groupService from '@/services/groupService';
import { IGroup } from '@/types/group';

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
      <div className="flex items-center gap-3">
        <Edit className="w-5 h-5 cursor-pointer" onClick={() => setEditModalOpen(true)} />
        <Trash2 className="w-5 h-5 cursor-pointer" onClick={() => setIsDeleteModalOpen(true)} />
        <Link
          href={`/courses/${data.courseId}/assignments/${data.assignmentId}/groups/${data.groupId}`}
          className="w-5 h-5 cursor-pointer"
        >
          <EyeIcon className="w-5 h-5 cursor-pointer" />
        </Link>
      </div>

      <EditGroupModal
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        group={data}
        minNumberOfMembers={data.course?.setting.minGroupSize || 1}
        maxNumberOfMembers={data.course?.setting.maxGroupSize || 15}
      />
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
