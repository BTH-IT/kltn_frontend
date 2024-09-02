/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { IProject } from '@/types';
import projectService from '@/services/projectService';

const CreateProjectContext = React.createContext({
  projects: [] as IProject[],
  setProjects: (_projects: IProject[]) => {},
});

const CreateProjectProvider = ({ children, projects }: { children: React.ReactNode; projects: IProject[] }) => {
  const [data, setData] = useState<IProject[]>(projects);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const res = await projectService.getProjectByCourseId(params.courseId as string);
      setData(res.data);
    };

    if (!projects || projects.length === 0) {
      fetchData();
    }
  }, [params.courseId, projects]);

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
