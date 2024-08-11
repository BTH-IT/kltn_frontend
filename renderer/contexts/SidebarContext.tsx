/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';

const SidebarContext = React.createContext({
  isShow: false,
  setSidebar: (_isShow: boolean) => {},
});

const SidebarProvider = ({ children, isShow }: { children: React.ReactNode; isShow: boolean }) => {
  const [data, setData] = useState<boolean>(false);

  useEffect(() => {
    setData(isShow);
  }, [isShow]);

  return (
    <SidebarContext.Provider
      value={{
        isShow: data,
        setSidebar: setData,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarContext, SidebarProvider };
