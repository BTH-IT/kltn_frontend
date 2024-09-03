'use client';

import { ChevronRight } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

import { IGroup } from '@/types/group';

interface CellActionProps {
  data: IGroup;
}

export const CellGoto: React.FC<CellActionProps> = ({ data }) => {
  return (
    <div className="flex items-center justify-center gap-3 w-14">
      <Link href={`/groups/${data.courseId}/${data.groupId}`}>
        <ChevronRight className="w-5 h-5 cursor-pointer" />
      </Link>
    </div>
  );
};
