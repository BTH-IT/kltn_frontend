/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { IClasses } from '@/types';

const ClassContext = React.createContext({
  classes: {} as IClasses | null,
  setClasses: (_classes: IClasses | null) => {},
});

const ClassProvider = ({ children, classes }: { children: React.ReactNode; classes: IClasses | null }) => {
  const [data, setData] = useState<IClasses | null>(null);

  useEffect(() => {
    setData(classes);
  }, [classes]);

  return (
    <ClassContext.Provider
      value={{
        classes: data,
        setClasses: setData,
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export { ClassContext, ClassProvider };
