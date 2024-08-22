'use client';

import React, { useContext } from 'react';

import People from '@/components/pages/courses/People';
import { CourseContext } from '@/contexts/CourseContext';

const PeoplePage = () => {
  const { course } = useContext(CourseContext);

  if (!course) return <></>;

  return (
    <>
      {course.lecturer && <People isTeacher data={[course.lecturer]} course={course} />}
      <People isTeacher={false} data={course.students} course={course} />
    </>
  );
};

export default PeoplePage;
