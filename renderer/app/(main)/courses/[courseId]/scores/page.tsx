/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import ScoreStructureTable from '@/components/pages/courses/score/ScoreStructureTable';
import ScoreStructureForm from '@/components/pages/courses/score/ScoreStructureForm';
import { IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';

const ScorePage = () => {
  const { course } = useContext(CourseContext);
  const { setItems } = useContext(BreadcrumbContext);

  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (!course) return;

    const breadcrumbLabel = course.name;

    setItems([
      { label: 'Lớp học', href: '/' },
      { label: breadcrumbLabel, href: `/courses/${course.courseId}` },
      { label: 'Điểm' },
    ]);
  }, [course, setItems]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || '{}');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, []);

  return (
    <div>
      <ScoreStructureProvider scoreStructure={course?.scoreStructure || null}>
        {course?.lecturerId === user?.id && <ScoreStructureForm />}
        <ScoreStructureTable />
      </ScoreStructureProvider>
    </div>
  );
};

export default ScorePage;
