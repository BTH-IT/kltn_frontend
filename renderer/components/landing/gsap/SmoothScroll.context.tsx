'use client';

import React, { createContext, useState } from 'react';

import useIsomorphicLayoutEffect from './UseIsomorphicLayoutEffect';

export const SmoothScrollContext = createContext<any>({ scroll: null });

const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLarge, setIsLarge] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && !isLarge) {
        setIsLarge(true);
      } else if (window.innerWidth < 1024 && isLarge) {
        setIsLarge(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isLarge]);

  return (
    <SmoothScrollContext.Provider value={{ scroll, isLarge }}>
      <div id="smooth-wrapper">
        <div id="smooth-content">{children}</div>
      </div>
    </SmoothScrollContext.Provider>
  );
};

export default SmoothScrollProvider;
