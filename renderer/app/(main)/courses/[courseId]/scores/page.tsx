/* eslint-disable no-unused-vars */
'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import ScoreStructureTable from '@/components/pages/courses/score/ScoreStructureTable';
import { BreadcrumbContext } from '@/contexts/BreadcrumbContext';
import scoreStructureService from '@/services/scoreStructureService';
import ScoreStructureStatistic from '@/components/common/ScoreStructureStatistic';
import { ITranscriptStatistic, IUser } from '@/types';
import { KEY_LOCALSTORAGE } from '@/utils';

const ScorePage = () => {
  const { course } = useContext(CourseContext);
  const { setItems } = useContext(BreadcrumbContext);
  const [transcriptStatistic, setTranscriptStatistic] = useState<ITranscriptStatistic[]>([]);

  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(KEY_LOCALSTORAGE.CURRENT_USER) || 'null');

    if (storedUser) {
      setUser(storedUser);
    } else {
      return router.push('/login');
    }
  }, [router]);

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
    const fetchData = async () => {
      if (!course) return;

      const res = await scoreStructureService.getTranscriptStatistic(course.courseId);

      setTranscriptStatistic(res.data?.columnStatistics || []);
    };

    if (course) {
      fetchData();
    }
  }, [course]);

  return (
    <>
      <ScoreStructureProvider scoreStructure={course?.scoreStructure || null}>
        {transcriptStatistic && user?.id === course?.lecturerId && (
          <ScoreStructureStatistic data={transcriptStatistic} />
        )}
        <ScoreStructureTable />
      </ScoreStructureProvider>
    </>
  );
};

export default ScorePage;
