'use client';

import React from 'react';
import { CircleHelp } from 'lucide-react';

import useGuide from '@/libs/hooks/useGuide';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const ShowGuideButton = () => {
  const { showGuide } = useGuide();

  const handleClick = () => {
    showGuide();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button className="block p-3 mr-1 rounded-full hover:bg-gray-100" onClick={handleClick}>
            <CircleHelp />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" align="center">
          Hướng dẫn sử dụng ứng dụng
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShowGuideButton;
