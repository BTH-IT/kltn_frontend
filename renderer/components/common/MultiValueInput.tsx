/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/libs/utils';

type MultiValueInputProps = {
  name: string;
  placeholder?: string;
  className?: string;
  regex?: RegExp;
};

const MultiValueInput = React.forwardRef<HTMLInputElement, MultiValueInputProps>(
  ({ name, placeholder, className, regex }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = React.useState('');
    const { control } = useFormContext();

    const addPendingDataPoint = (field: any) => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...field.value, pendingDataPoint]);
        field.onChange(Array.from(newDataPoints));
        setPendingDataPoint('');
      }
    };

    return (
      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        render={({ field }) => (
          <div
            className={cn(
              'has-[:focus-visible]:outline-none has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-neutral-300 min-h-10 flex w-full flex-wrap gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white  disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 outline-none',
              className,
            )}
          >
            {field.value.map((item: string, index: number) => (
              <Badge key={item + index} variant="secondary">
                {item}
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-3 h-3 ml-2"
                  onClick={() => {
                    const newDataPoints = field.value.filter((i: string) => i !== item);
                    field.onChange(newDataPoints);
                  }}
                >
                  <XIcon className="w-3" />
                </Button>
              </Badge>
            ))}
            <input
              className="flex-1 outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              value={pendingDataPoint}
              onChange={(e) => setPendingDataPoint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  if (regex && !regex.test(pendingDataPoint)) {
                    // Show error if regex does not match
                    return;
                  }
                  addPendingDataPoint(field);
                } else if (e.key === 'Backspace' && pendingDataPoint.length === 0 && field.value.length > 0) {
                  e.preventDefault();
                  field.onChange(field.value.slice(0, -1));
                }
              }}
              placeholder={placeholder}
              ref={ref}
            />
          </div>
        )}
      />
    );
  },
);

MultiValueInput.displayName = 'MultiValueInput';

export { MultiValueInput };
