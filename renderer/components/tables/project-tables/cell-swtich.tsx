/* eslint-disable no-unused-vars */
'use client';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { IProject } from '@/types/project';
import projectService from '@/services/projectService';
import { Switch } from '@/components/ui/switch';

interface CellSwitchProps {
  data: IProject;
}

export const CellSwitch: React.FC<CellSwitchProps> = ({ data }) => {
  const handleChange = async (checked: boolean) => {
    try {
      await projectService.updateProject(data.projectId, {
        ...data,
        isApproved: checked,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return <Switch checked={data.isApproved} onCheckedChange={handleChange} />;
};
