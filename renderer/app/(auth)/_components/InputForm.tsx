'use client';

import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

import { Input, InputProps } from '@/components/ui/input';

interface InputFormProps extends InputProps {
  control: any;
  error?: string | undefined;
  name: string;
  iconStart?: React.ReactNode;
  iconEnd?: boolean;
}

const InputForm = ({ control, name, error, className, iconStart, iconEnd = false, ...rest }: InputFormProps) => {
  const [showIcon, setShowIcon] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Controller
        control={control}
        render={({ field }) => (
          <div className="relative">
            <div className="absolute -translate-y-1/2 left-4 top-1/2">{iconStart}</div>
            <Input
              {...rest}
              {...field}
              className={`${className} pl-12 pr-4 pt-6 pb-6`}
              type={showIcon ? 'text' : rest.type}
            />
            <div
              className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
              onClick={() => setShowIcon(!showIcon)}
            >
              {iconEnd ? showIcon ? <Eye /> : <EyeOff /> : <></>}
            </div>
          </div>
        )}
        name={name}
      />
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};

export default InputForm;
