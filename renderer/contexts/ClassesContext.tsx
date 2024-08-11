/* eslint-disable no-unused-vars */
'use client';

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';

import { IClasses } from '@/types';
import classService from '@/services/classService';

const ClassesContext = React.createContext({
  classesCreated: [] as IClasses[],
  classesEnrolled: [] as IClasses[],
  setClassesCreated: (_classes: IClasses[]) => {},
  setClassesEnrolled: (_classes: IClasses[]) => {},
  isLoading: true,
});

const ClassesProvider = ({ children }: { children: React.ReactNode }) => {
  const [classesCreated, setClassesCreated] = useState<IClasses[]>([]);
  const [classesEnrolled, setClassesEnrolled] = useState<IClasses[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const getClasses = async () => {
      try {
        if (user) {
          setIsLoading(true);
          const res = await classService.getClassesByUser(user.id);
          setClassesEnrolled(res.data.classesEnrolled);
          setClassesCreated(res.data.classesCreated);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getClasses();
  }, [user]);

  return (
    <ClassesContext.Provider
      value={{
        classesCreated,
        classesEnrolled,
        setClassesCreated,
        setClassesEnrolled,
        isLoading,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
};

export { ClassesContext, ClassesProvider };
