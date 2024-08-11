/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

const ClassHeaderContext = React.createContext({
  isShow: true,
  setShow: (_isShow: boolean) => {},
});

const ClassHeaderProvider = ({ children, isShow }: { children: React.ReactNode; isShow: boolean }) => {
  const [data, setData] = useState<boolean>(true);

  useEffect(() => {
    setData(isShow);
  }, [isShow]);

  return (
    <ClassHeaderContext.Provider
      value={{
        isShow: data,
        setShow: setData,
      }}
    >
      {children}
    </ClassHeaderContext.Provider>
  );
};

export { ClassHeaderContext, ClassHeaderProvider };
