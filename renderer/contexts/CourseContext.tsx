/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { ICourse } from '@/types';
import courseService from '@/services/courseService';

const CourseContext = React.createContext({
  course: {} as ICourse | null,
  setCourse: (_course: ICourse | null) => {},
});

const CourseProvider = ({ children, course }: { children: React.ReactNode; course: ICourse | null }) => {
  const [data, setData] = useState<ICourse | null>(null);
  const params = useParams();

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await courseService.getCourseById(params.courseId as string);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (course) {
      setData(course);
    } else if (params.courseId) {
      fetchCourse();
    }
  }, [course, params.courseId]);

  return (
    <CourseContext.Provider
      value={{
        course: data,
        setCourse: setData,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export { CourseContext, CourseProvider };
