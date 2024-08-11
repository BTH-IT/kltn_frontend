'use client';

import React, { useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

import ScoreStructureForm from '@/components/pages/classes/score/ScoreStructureForm';
import { ScoreStructureProvider } from '@/contexts/ScoreStructureContext';
import ScoreStructureTable from '@/components/pages/classes/score/ScoreStructureTable';
import { ClassContext } from '@/contexts/ClassContext';

const defaultScoreStructures = [
  {
    id: uuidv4(),
    columnName: 'Tổng điểm',
    percent: 100,
    maxPercent: 100,
  },
];

const ScorePage = () => {
  const { classes } = useContext(ClassContext);

  return (
    <div>
      <ScoreStructureProvider
        scoreStructures={JSON.parse(
          classes?.scoreStructure && classes?.scoreStructure !== '[]'
            ? classes?.scoreStructure
            : JSON.stringify(defaultScoreStructures),
        )}
      >
        <ScoreStructureTable />
        <ScoreStructureForm />
        {/* {classes?.scoreStructure && classes?.scoreStructure !== '[]' ? <ScoreStructureTable /> : <ScoreStructureForm />} */}
      </ScoreStructureProvider>
    </div>
  );
};

export default ScorePage;
