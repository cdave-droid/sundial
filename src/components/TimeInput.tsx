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
      <div className="space-y-2">
        <Label className="text-sm font-medium">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {format(value, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
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
      
      <div className="space-y-2">
        <Label className="text-sm font-medium">Time</Label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={hours}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                setHours(val);
                handleTimeChange(val, minutes);
              }}
              className="w-16 pl-10 text-center font-mono text-lg"
              maxLength={2}
            />
          </div>
          <span className="text-2xl font-bold text-muted-foreground">:</span>
          <Input
            type="text"
            value={minutes}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 2);
              setMinutes(val);
              handleTimeChange(hours, val);
            }}
            className="w-16 text-center font-mono text-lg"
            maxLength={2}
          />
        </div>
      </div>
      
      <Button variant="secondary" onClick={setToNow} className="h-10">
        Now
      </Button>
    </div>
  );
}
