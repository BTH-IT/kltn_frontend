/* eslint-disable no-unused-vars */
'use client';
import { ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import CommonModal from '@/components/modals/CommonModal';
import { IGroup } from '@/types/group';
import groupService from '@/services/groupService';
import { EditGroupModal } from '@/components/modals/EditGroupModal';
import { useGroupContext } from '@/contexts/GroupContext';
import Link from 'next/link';

interface CellActionProps {
  data: IGroup;
}

export const CellGoto: React.FC<CellActionProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-center gap-3 w-14">
        <Link href={`/groups/${data.groupId}`}>
          <ChevronRight className="w-5 h-5 cursor-pointer" />
        </Link>
      </div>
    </>
  );
};
