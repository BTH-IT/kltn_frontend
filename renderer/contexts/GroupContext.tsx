'use client';

import React, { useContext, useState } from 'react';

import { IGroup } from '@/types/group';

interface IGroupContext {
  groups: IGroup[];
  setGroups: React.Dispatch<React.SetStateAction<IGroup[]>>;
}

export const GroupContext = React.createContext<IGroupContext | undefined>(undefined);

export const GroupContextProvider = ({
  children,
  initialGroups,
}: {
  children: React.ReactNode;
  initialGroups: IGroup[];
}) => {
  const [groups, setGroups] = useState<IGroup[]>(initialGroups || []);
  return <GroupContext.Provider value={{ groups, setGroups }}>{children}</GroupContext.Provider>;
};
export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroupContext must be used within a GroupProvider');
  }
  return context; // Phải trả về một đối tượng
};
