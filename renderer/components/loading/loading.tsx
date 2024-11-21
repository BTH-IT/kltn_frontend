'use client';
import React from 'react';

import { cn } from '@/libs/utils';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function Loading({ size = 'small', className }: LoadingProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  return (
    <div className={cn('relative flex items-center justify-center !w-full !h-full', '', className)}>
      <svg className={cn('', sizeClasses[size], '')} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dynamicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6">
              <animate
                attributeName="stop-color"
                values="#3b82f6; #8b5cf6; #10b981; #3b82f6"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#8b5cf6">
              <animate
                attributeName="stop-color"
                values="#8b5cf6; #10b981; #3b82f6; #8b5cf6"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        <style>
          {`
            @keyframes rotateAndDash {
              0% { transform: rotate(0deg); stroke-dashoffset: 0; }
              50% { stroke-dashoffset: 88; }
              100% { transform: rotate(360deg); stroke-dashoffset: 0; }
            }
          `}
        </style>

        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#dynamicGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            animation: 'rotateAndDash 4s ease-in-out infinite',
            transformOrigin: 'center',
            strokeDasharray: '44 44',
          }}
        />
      </svg>
    </div>
  );
}
