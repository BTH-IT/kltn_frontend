/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { IProject } from '@/types';
import projectService from '@/services/projectService';

const CreateProjectContext = React.createContext({
  projects: [] as IProject[],
  setProjects: (_projects: IProject[]) => {},
});

const CreateProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<IProject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await projectService.getProjects();
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <CreateProjectContext.Provider
      value={{
        projects: data,
        setProjects: setData,
      }}
    >
      {children}
    </CreateProjectContext.Provider>
  );
};

export { CreateProjectContext, CreateProjectProvider };
