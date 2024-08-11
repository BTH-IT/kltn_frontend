/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { IScoreStructure } from '@/types';

const ScoreStructureContext = React.createContext({
  scoreStructures: [] as IScoreStructure[],
  setScoreStructures: (_scoreStructures: IScoreStructure[]) => {},
});

const ScoreStructureProvider = ({
  children,
  scoreStructures,
}: {
  children: React.ReactNode;
  scoreStructures: IScoreStructure[];
}) => {
  const [data, setData] = useState<IScoreStructure[]>([]);

  useEffect(() => {
    setData(scoreStructures);
  }, [scoreStructures]);

  return (
    <ScoreStructureContext.Provider
      value={{
        scoreStructures: data,
        setScoreStructures: setData,
      }}
    >
      {children}
    </ScoreStructureContext.Provider>
  );
};

export { ScoreStructureContext, ScoreStructureProvider };
