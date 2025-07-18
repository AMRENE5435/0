import React, { useState } from 'react';
import { Calendar, CalendarDays } from 'lucide-react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar as CalendarComponent } from './calendar';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const DateRangePicker = ({ 
  className, 
  onDateChange, 
  initialDateFrom, 
  initialDateTo,
  placeholder = "Select date range"
}) => {
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (range) => {
    if (range?.from) {
      setDateFrom(range.from);
    }
    if (range?.to) {
      setDateTo(range.to);
      setIsOpen(false);
    }
    
    if (onDateChange) {
      onDateChange({ from: range?.from || dateFrom, to: range?.to || dateTo });
    }
  };

  const formatDateRange = () => {
    if (dateFrom && dateTo) {
      return `${format(dateFrom, 'MMM dd, yyyy')} - ${format(dateTo, 'MMM dd, yyyy')}`;
    } else if (dateFrom) {
      return format(dateFrom, 'MMM dd, yyyy');
    }
    return placeholder;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateFrom && "text-muted-foreground"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateFrom}
            selected={{ from: dateFrom, to: dateTo }}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DateRangePicker, DateRangePicker as DatePickerWithRange };

