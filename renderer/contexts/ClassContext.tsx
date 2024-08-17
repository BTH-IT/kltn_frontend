/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

import { ICourse } from '@/types';

const ClassContext = React.createContext({
  classes: {} as ICourse | null,
  setClasses: (_classes: ICourse | null) => {},
});

const ClassProvider = ({ children, classes }: { children: React.ReactNode; classes: ICourse | null }) => {
  const [data, setData] = useState<ICourse | null>(null);

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
