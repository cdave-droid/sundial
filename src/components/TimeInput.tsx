import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { City, getTimeInTimezone } from '@/lib/timezones';

interface TimeInputProps {
  value: Date;
  onChange: (date: Date) => void;
  homeCity: City;
}

// Convert a local time in a specific timezone to a UTC Date object
function localTimeToUTC(year: number, month: number, day: number, hours: number, minutes: number, timezone: string): Date {
  // Create a date string that represents the local time in the target timezone
  const targetDate = new Date(Date.UTC(year, month, day, hours, minutes, 0, 0));
  
  // Get what this UTC time looks like in the target timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  // Binary search to find the correct UTC time that gives us the desired local time
  let low = targetDate.getTime() - 24 * 60 * 60 * 1000;
  let high = targetDate.getTime() + 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < 20; i++) {
    const mid = Math.floor((low + high) / 2);
    const testDate = new Date(mid);
    const parts = formatter.formatToParts(testDate);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '0';
    
    const testHour = parseInt(getPart('hour'));
    const testMinute = parseInt(getPart('minute'));
    const testDay = parseInt(getPart('day'));
    const testMonth = parseInt(getPart('month')) - 1;
    const testYear = parseInt(getPart('year'));
    
    const targetMinutes = year * 525600 + month * 43800 + day * 1440 + hours * 60 + minutes;
    const testMinutes = testYear * 525600 + testMonth * 43800 + testDay * 1440 + testHour * 60 + testMinute;
    
    if (testMinutes === targetMinutes) {
      return testDate;
    } else if (testMinutes < targetMinutes) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return new Date(Math.floor((low + high) / 2));
}

export function TimeInput({ value, onChange, homeCity }: TimeInputProps) {
  // Get the current time in the home city's timezone
  const homeTime = getTimeInTimezone(value, homeCity.timezone);
  
  const [hours, setHours] = useState(homeTime.getHours().toString().padStart(2, '0'));
  const [minutes, setMinutes] = useState(homeTime.getMinutes().toString().padStart(2, '0'));

  useEffect(() => {
    const newHomeTime = getTimeInTimezone(value, homeCity.timezone);
    setHours(newHomeTime.getHours().toString().padStart(2, '0'));
    setMinutes(newHomeTime.getMinutes().toString().padStart(2, '0'));
  }, [value, homeCity.timezone]);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const h = parseInt(newHours) || 0;
    const m = parseInt(newMinutes) || 0;
    
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      // Convert the selected home city local time to UTC
      const newDate = localTimeToUTC(
        homeTime.getFullYear(),
        homeTime.getMonth(),
        homeTime.getDate(),
        h,
        m,
        homeCity.timezone
      );
      onChange(newDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const h = parseInt(hours) || 0;
      const m = parseInt(minutes) || 0;
      // Convert the selected date + current time to UTC using home city timezone
      const newDate = localTimeToUTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        h,
        m,
        homeCity.timezone
      );
      onChange(newDate);
    }
  };

  const setToNow = () => {
    onChange(new Date());
  };

  // Create a Date object for the calendar that represents the home city's current date
  const calendarDate = new Date(homeTime.getFullYear(), homeTime.getMonth(), homeTime.getDate());

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-zinc-400">Date ({homeCity.name})</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal bg-zinc-700/50 border-zinc-600 text-white hover:bg-zinc-700 hover:text-white",
                !value && "text-zinc-500"
              )}
            >
              <Calendar className="mr-2 h-4 w-4 text-amber-400" />
              {format(calendarDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-zinc-800 border-amber-500/20" align="start">
            <CalendarComponent
              mode="single"
              selected={calendarDate}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-zinc-400">Time ({homeCity.name})</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[140px] justify-start text-left font-normal bg-zinc-700/50 border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
              )}
            >
              <Clock className="mr-2 h-4 w-4 text-amber-400" />
              {hours}:{minutes}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 bg-zinc-800 border-amber-500/20" align="start">
            <div className="grid grid-cols-3 gap-1 max-h-[200px] overflow-y-auto">
              {Array.from({ length: 24 }, (_, h) => (
                [0, 30].map(m => {
                  const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                  const isSelected = hours === h.toString().padStart(2, '0') && minutes === m.toString().padStart(2, '0');
                  return (
                    <Button
                      key={timeStr}
                      variant={isSelected ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "text-xs font-mono",
                        isSelected ? "bg-amber-500 text-zinc-900 hover:bg-amber-400" : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                      )}
                      onClick={() => {
                        setHours(h.toString().padStart(2, '0'));
                        setMinutes(m.toString().padStart(2, '0'));
                        handleTimeChange(h.toString().padStart(2, '0'), m.toString().padStart(2, '0'));
                      }}
                    >
                      {timeStr}
                    </Button>
                  );
                })
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        variant="secondary" 
        onClick={setToNow} 
        className="h-10 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:text-amber-300 border border-amber-500/30"
      >
        Now
      </Button>
    </div>
  );
}
