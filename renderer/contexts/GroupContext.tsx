'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { IGroup } from '@/types/group';
import groupService from '@/services/groupService';

interface IGroupContext {
  groups: IGroup[];
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
}

export const GroupContext = React.createContext<IGroupContext | undefined>(undefined);

export const GroupContextProvider = ({ children, groups }: { children: React.ReactNode; groups: IGroup[] }) => {
  const [data, setData] = useState<IGroup[]>(groups || []);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const res = await groupService.getGroupsByCourseId(params.courseId as string);
      setData(res.data);
    };

    if (!groups || groups.length === 0) {
      fetchData();
    }
  }, [params.courseId]);
  return (
    <GroupContext.Provider
      value={{
        groups: data,
        setGroups: setData,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroupContext must be used within a GroupProvider');
  }
  return context; // Phải trả về một đối tượng
};
