'use client';

import React, { useContext } from 'react';

import People from '@/components/pages/courses/People';
import { CourseContext } from '@/contexts/CourseContext';

const PeoplePage = () => {
  const { course } = useContext(CourseContext);

  if (!course) return <></>;

  return (
    <>
      {course.teacher && <People isTeacher data={[course.teacher]} course={course} />}
      <People isTeacher={false} data={course.students} course={course} />
    </>
  );
};

export default PeoplePage;
