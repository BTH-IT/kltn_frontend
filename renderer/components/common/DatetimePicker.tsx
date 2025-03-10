'use client';

import { add, addHours } from 'date-fns';
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
  onChange = () => {},
  minDate, // Thêm minDate prop
}: {
  date?: Date | null | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | null | undefined>>;
  onChange?: () => void;
  minDate?: Date; // Định nghĩa kiểu của minDate
}) {
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    const adjustedDate = addHours(newDay, 7);
    if (!date) {
      setDate(adjustedDate);
      onChange();
      return;
    }
    const diff = adjustedDate.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });

    setDate(newDateFull);
    onChange();
  };

  const handleSetDate = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      onChange();
    }
  };

  const handleClear = () => {
    setDate(undefined);
    onChange();
  };

  React.useEffect(() => {
    if (minDate) {
      minDate.setHours(0, 0, 0, 0);
    }
  }, []);

  return (
    <div className="inline-flex items-center w-full">
      <div className="relative flex-1 w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                '!max-w-[280px] w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              <div className="flex items-center justify-between flex-1 gap-2">
                {date && !isNaN(date.getTime()) ? (
                  formatVNDate(date.toISOString() || '')
                ) : (
                  <span>Không có ngày hạn</span>
                )}
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
              disabled={(date) => (minDate ? date < minDate : false)}
              initialFocus
            />
            <div className="p-3 border-t border-border">
              <TimePicker setDate={handleSetDate} date={date || undefined} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {date && !isNaN(date.getTime()) && (
          <XIcon
            className="absolute w-4 h-4 ml-2 -translate-y-1/2 cursor-pointer right-2 top-1/2"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện mở DropdownMenu
              handleClear();
            }}
          />
        )}
      </div>
    </div>
  );
}
