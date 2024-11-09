/* eslint-disable no-unused-vars */
'use client';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Switch } from '@/components/ui/switch';
import { IGroup } from '@/types/group';
import groupService from '@/services/groupService';

interface CellSwitchProps {
  data: IGroup;
}

export const CellSwitch: React.FC<CellSwitchProps> = ({ data }) => {
  const [checkedState, setIsCheckedState] = useState<boolean>(false);

  useEffect(() => {
    setIsCheckedState(data.isApproved);
  }, [data]);

  const handleChange = async (checked: boolean) => {
    try {
      await groupService.updateGroup(data.groupId, {
        ...data,
        isApproved: checked,
      });
      setIsCheckedState(checked);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return <Switch checked={checkedState} onCheckedChange={handleChange} />;
};
