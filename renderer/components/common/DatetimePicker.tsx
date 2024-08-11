import * as React from 'react';
import { add, format } from 'date-fns';
import { Calendar as CalendarIcon, X as XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/libs/utils';

import { TimePicker } from './TimePicker';

export function DateTimePicker({
  date,
  setDate,
}: {
  date?: Date;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}) {
  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 w-4 h-4" />
          <div className="flex flex-1 gap-2 justify-between items-center">
            {date ? format(date, 'PPP HH:mm:ss') : <span>Không có ngày hạn</span>}
            {date && <XIcon className="ml-2 w-4 h-4" onClick={handleClear} />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar mode="single" selected={date} onSelect={(d: Date | undefined) => d && handleSelect(d)} initialFocus />
        <div className="p-3 border-t border-border">
          <TimePicker setDate={handleSetDate} date={date} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
