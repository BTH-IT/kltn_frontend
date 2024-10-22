/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';

import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import ScoreStructureTable from '@/components/pages/courses/score/ScoreStructureTable';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

const ScorePage = () => {
  const { course } = useContext(CourseContext);
  const { setItems } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!course) return;

    const breadcrumbLabel = course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel, href: `/courses/${course.courseId}` },
      { label: 'Điểm' },
    ]);
  }, [course, setItems]);

  return (
    <div>
      <ScoreStructureProvider scoreStructure={course?.scoreStructure || null}>
        <ScoreStructureTable />
      </ScoreStructureProvider>
    </div>
  );
};

export default ScorePage;
