import React from 'react';

import '@/styles/components/loading/loading.scss';
import { cn } from '@/libs/utils';

interface LoadingProps {
  containerClassName?: string;
  spinnerClassName?: string;
}

const Loading = ({ containerClassName, spinnerClassName }: LoadingProps) => {
  return (
    <div className={cn('loading__container', containerClassName)}>
      <div className={cn('loading__spinner', spinnerClassName)}></div>
    </div>
  );
};

export default Loading;
