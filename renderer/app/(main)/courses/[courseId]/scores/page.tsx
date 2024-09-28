/* eslint-disable no-unused-vars */
'use client';

import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import ScoreStructureTable from '@/components/pages/courses/score/ScoreStructureTable';
import ScoreStructureForm from '@/components/pages/courses/score/ScoreStructureForm';
import TwoColumnGradeTable from '@/components/pages/courses/score/Test';

const defaultScoreStructures = [
  {
    id: uuidv4(),
    columnName: 'Tổng điểm',
    percent: 100,
    maxPercent: 100,
  },
];

const ScorePage = () => {
  const { course } = useContext(CourseContext);

  return (
    <div>
      <ScoreStructureProvider scoreStructures={JSON.parse(JSON.stringify(defaultScoreStructures))}>
        <TwoColumnGradeTable />
      </ScoreStructureProvider>
    </div>
  );
};

export default ScorePage;
