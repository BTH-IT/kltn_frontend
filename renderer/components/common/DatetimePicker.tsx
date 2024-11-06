import { add } from 'date-fns';
import { Calendar as CalendarIcon, X as XIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/libs/utils';
import { formatVNDate } from '@/utils';

import { TimePicker } from './TimePicker';

export function DateTimePicker({
  date,
  setDate,
}: {
  date?: Date | null | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | null | undefined>>;
}) {
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });

    setDate(newDateFull);
  };

  const handleSetDate = (date: Date | undefined) => {
    if (date) {
      setDate(date);
    }
  };

  const handleClear = () => {
    setDate(undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          <div className="flex items-center justify-between flex-1 gap-2">
            {date && !isNaN(date.getTime()) ? formatVNDate(date.toISOString() || '') : <span>Không có ngày hạn</span>}
            {date && !isNaN(date.getTime()) && <XIcon className="w-4 h-4 ml-2" onClick={handleClear} />}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="center" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={(d: Date | undefined) => {
            d && handleSelect(d);
          }}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <TimePicker setDate={handleSetDate} date={date || undefined} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
