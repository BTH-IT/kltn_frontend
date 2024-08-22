/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import semesterService from '@/services/semesterService';
import { ISemester } from '@/types/semester';

const CreateSemesterContext = React.createContext({
  semesters: [] as ISemester[],
  setSemesters: (_semesters: ISemester[]) => {},
});

const CreateSemesterProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ISemester[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await semesterService.getSemesters();
      setData(res.data);
    };

    fetchData();
  }, []);

  return (
    <CreateSemesterContext.Provider
      value={{
        semesters: data,
        setSemesters: setData,
      }}
    >
      {children}
    </CreateSemesterContext.Provider>
  );
};

export { CreateSemesterContext, CreateSemesterProvider };
