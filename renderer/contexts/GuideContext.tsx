/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface GuideContextType {
  isShow: boolean;
  setGuide: (isShow: boolean) => void;
  setSteps: (steps: any[]) => void;
  steps: any[];
}

const GuideContext = createContext<GuideContextType>({
  isShow: false,
  setGuide: () => {},
  setSteps: () => {},
  steps: [],
});

interface GuideProviderProps {
  children: ReactNode;
  isShow: boolean;
  steps: any[];
}

const GuideProvider: React.FC<GuideProviderProps> = ({ children, isShow, steps }) => {
  const [data, setData] = useState<boolean>(isShow);
  const [currentSteps, setCurrentSteps] = useState<any[]>(steps);

  useEffect(() => {
    setCurrentSteps(steps);
  }, [steps]);

  return (
    <GuideContext.Provider
      value={{
        isShow: data,
        setGuide: setData,
        steps: currentSteps,
        setSteps: setCurrentSteps,
      }}
    >
      {children}
    </GuideContext.Provider>
  );
};

export { GuideContext, GuideProvider };
