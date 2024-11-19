/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { ICourse, IUser } from '@/types';
import courseService from '@/services/courseService';

const CoursesContext = React.createContext({
  createdCourses: [] as ICourse[],
  enrolledCourses: [] as ICourse[],
  setCreatedCourses: (_course: ICourse[]) => {},
  setEnrolledCourses: (_course: ICourse[]) => {},
  isLoading: true,
});

const CoursesProvider = ({ children, user }: { children: React.ReactNode; user: IUser | null }) => {
  const [createdCourses, setCreatedCourses] = useState<ICourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setIsLoading(true);
        const res = await courseService.getCoursesByUser();
        setCreatedCourses(res.data.createdCourses);
        setEnrolledCourses(res.data.enrolledCourses);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCourse();
  }, [user]);

  return (
    <CoursesContext.Provider
      value={{
        createdCourses,
        enrolledCourses,
        setCreatedCourses,
        setEnrolledCourses,
        isLoading,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export { CoursesContext, CoursesProvider };
