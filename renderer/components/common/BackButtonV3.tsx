'use client';
import * as Icons from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function BackButtonV3({
  url,
  icon = 'ArrowLeftFromLine',
  iconSize = 8,
  iconColor = 'text-white',
  tooltipText = 'Go Back',
}: {
  url: string;
  icon?: keyof typeof Icons;
  iconSize?: number;
  iconColor?: string;
  tooltipText?: string; // Text to display in the tooltip
}) {
  const router = useRouter();
  // eslint-disable-next-line import/namespace
  const IconComponent = Icons[icon] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <IconComponent
            className={`w-${iconSize} h-${iconSize} ${iconColor} cursor-pointer`}
            onClick={() => {
              router.push(url);
            }}
          />
        </TooltipTrigger>
        <TooltipContent>{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
