'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic từ Next.js
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import useGuide from '@/libs/hooks/useGuide';

const Tour = dynamic(() => import('reactour'), { ssr: false });

const Guide = () => {
  const { isShow, hideGuide, steps: data, showGuide } = useGuide();

  const [isClient, setIsClient] = useState(false);

  const disableBody = (target: any) => disableBodyScroll(target);
  const enableBody = (target: any) => enableBodyScroll(target);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const hasSeenGuide = localStorage.getItem('hasSeenGuide-home');
      if (!hasSeenGuide) {
        localStorage.setItem('hasSeenGuide-home', 'true');
        showGuide();
      }
    }
  }, [isClient]);

  if (!isClient || data.length <= 0) return null;

  return (
    <Tour
      onRequestClose={hideGuide}
      steps={data}
      isOpen={isShow}
      rounded={5}
      onAfterOpen={disableBody}
      onBeforeClose={enableBody}
      disableInteraction
      inViewThreshold={50}
      showButtons={true}
    >
      <button onClick={hideGuide} style={{ position: 'absolute', bottom: '20px', left: '30px' }}>
        Skip
      </button>
    </Tour>
  );
};

export default Guide;
