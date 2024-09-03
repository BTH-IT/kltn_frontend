/* eslint-disable no-unused-vars */
'use client';

import React from 'react';

import { IGroup } from '@/types/group';
import groupService from '@/services/groupService';
import Button from '@/components/common/Button';

interface CellJoinProps {
  data: IGroup;
}

export const CellJoin: React.FC<CellJoinProps> = ({ data }) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button buttonType="primary">Gửi yêu cầu tham gia</Button>
    </div>
  );
};
