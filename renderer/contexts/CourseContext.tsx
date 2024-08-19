/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { ICourse } from '@/types';

const CourseContext = React.createContext({
  course: {} as ICourse | null,
  setCourse: (_course: ICourse | null) => {},
});

const CourseProvider = ({ children, course }: { children: React.ReactNode; course: ICourse | null }) => {
  const [data, setData] = useState<ICourse | null>(null);

  useEffect(() => {
    setData(course);
  }, [course]);

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
