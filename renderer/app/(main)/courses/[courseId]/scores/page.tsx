/* eslint-disable no-unused-vars */
'use client';

import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import { CourseContext } from '@/contexts/CourseContext';
import ScoreStructureTable from '@/components/pages/courses/score/ScoreStructureTable';
import ScoreStructureForm from '@/components/pages/courses/score/ScoreStructureForm';

const ScorePage = () => {
  const { course } = useContext(CourseContext);

  return (
    <div>
      <ScoreStructureProvider scoreStructure={course?.scoreStructure || null}>
        <ScoreStructureTable />
        <ScoreStructureForm />
      </ScoreStructureProvider>
    </div>
  );
};

export default ScorePage;
