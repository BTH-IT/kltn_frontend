/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { IProject } from '@/types';
import projectService from '@/services/projectService';

const CreateProjectContext = React.createContext({
  projects: [] as IProject[],
  setProjects: (_projects: IProject[]) => {},
});

const CreateProjectProvider = ({ children, projects }: { children: React.ReactNode; projects: IProject[] }) => {
  const [data, setData] = useState<IProject[]>(projects);

  useEffect(() => {
    const fetchData = async () => {
      const res = await projectService.getProjects();
      setData(res.data);
    };

    if (!projects || projects.length === 0) {
      fetchData();
    }
  }, [projects]);

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
