'use client';

import React, { useContext, useEffect } from 'react';

import People from '@/components/pages/courses/People';
import { CourseContext } from '@/contexts/CourseContext';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

const PeoplePage = () => {
  const { course } = useContext(CourseContext);
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!course) return;

    const breadcrumbLabel = course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel, href: `/courses/${course.courseId}` },
      { label: 'Mọi người' },
    ]);
  }, [course, setItems]);

  if (!course) return <></>;

  return (
    <>
      {course.lecturer && <People isTeacher data={[course.lecturer]} course={course} />}
      <People isTeacher={false} data={course.students} course={course} />
    </>
  );
};

export default PeoplePage;
