/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { ICourse } from '@/types';
import courseService from '@/services/courseService';

const CoursesContext = React.createContext({
  createdCourses: [] as ICourse[],
  enrolledCourses: [] as ICourse[],
  setCreatedCourses: (_course: ICourse[]) => {},
  setEnrolledCourses: (_course: ICourse[]) => {},
  isLoading: true,
});

const CoursesProvider = ({ children }: { children: React.ReactNode }) => {
  const [createdCourses, setCreatedCourses] = useState<ICourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const getCourse = async () => {
      try {
        if (user) {
          setIsLoading(true);
          const res = await courseService.getCoursesByUser(user.userId);
          setCreatedCourses(res.data.courses);
          setEnrolledCourses(res.data.courses);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      getCourse();
    }
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
