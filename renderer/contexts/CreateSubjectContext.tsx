/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { ISubject } from '@/types';

const CreateSubjectContext = React.createContext({
  subjects: [] as ISubject[],
  setSubjects: (_subjects: ISubject[]) => {},
});

const CreateSubjectProvider = ({ children, subjects }: { children: React.ReactNode; subjects: ISubject[] }) => {
  const [data, setData] = useState<ISubject[]>([]);

  useEffect(() => {
    setData(subjects);
  }, [subjects]);

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
