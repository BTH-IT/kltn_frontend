/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { IScoreStructure } from '@/types';

const ScoreStructureContext = React.createContext({
  scoreStructure: null as IScoreStructure | null,
  setScoreStructure: (_scoreStructure: IScoreStructure) => {},
});

const ScoreStructureProvider = ({
  children,
  scoreStructure,
}: {
  children: React.ReactNode;
  scoreStructure: IScoreStructure | null;
}) => {
  const [data, setData] = useState<IScoreStructure | null>(null);

  useEffect(() => {
    setData(scoreStructure);
  }, [scoreStructure]);

  return (
    <ScoreStructureContext.Provider
      value={{
        scoreStructure: data,
        setScoreStructure: setData,
      }}
    >
      {children}
    </ScoreStructureContext.Provider>
  );
};

export { ScoreStructureContext, ScoreStructureProvider };
