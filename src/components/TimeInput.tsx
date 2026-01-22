import { useState, useEffect } from 'react';
import { Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TimeInputProps {
  value: Date;
  onChange: (date: Date) => void;
}

export function TimeInput({ value, onChange }: TimeInputProps) {
  const [hours, setHours] = useState(value.getHours().toString().padStart(2, '0'));
  const [minutes, setMinutes] = useState(value.getMinutes().toString().padStart(2, '0'));

  useEffect(() => {
    setHours(value.getHours().toString().padStart(2, '0'));
    setMinutes(value.getMinutes().toString().padStart(2, '0'));
  }, [value]);

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const h = parseInt(newHours) || 0;
    const m = parseInt(newMinutes) || 0;
    
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      const newDate = new Date(value);
      newDate.setHours(h, m);
      onChange(newDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours) || 0, parseInt(minutes) || 0);
      onChange(newDate);
    }
  };

  const setToNow = () => {
    onChange(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-400">Date</Label>
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
              {format(value, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-zinc-800 border-amber-500/20" align="start">
            <CalendarComponent
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-3">
        <Label className="text-sm font-medium text-zinc-400">Time</Label>
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
