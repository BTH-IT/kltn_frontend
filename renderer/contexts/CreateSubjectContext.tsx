/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { ISubject } from '@/types';
import subjectService from '@/services/subjectService';
import { logError } from '@/libs/utils';

const CreateSubjectContext = React.createContext({
  subjects: [] as ISubject[],
  setSubjects: (_subjects: ISubject[]) => {},
});

const CreateSubjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ISubject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await subjectService.getSubjects();
        setData(res.data);
      } catch (error) {
        logError(error);
      }
    };

    fetchData();
  }, []);

  return (
    <CreateSubjectContext.Provider
      value={{
        subjects: data,
        setSubjects: setData,
      }}
    >
      {children}
    </CreateSubjectContext.Provider>
  );
};

export { CreateSubjectContext, CreateSubjectProvider };
