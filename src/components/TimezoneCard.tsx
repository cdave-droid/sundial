import { City, getTimeInTimezone, formatTime, formatDate, isDaytime } from '@/lib/timezones';
import { X, Sun, Moon, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface TimezoneCardProps {
  city: City;
  baseTime: Date;
  onRemove: (id: string) => void;
  isHome?: boolean;
}

export function TimezoneCard({ city, baseTime, onRemove, isHome = false }: TimezoneCardProps) {
  const localTime = getTimeInTimezone(baseTime, city.timezone);
  const isDay = isDaytime(localTime);
  const hour = localTime.getHours();
  
  // Determine background based on time of day
  const getBackgroundClass = () => {
    if (hour >= 5 && hour < 8) return 'timezone-card-dawn';
    if (hour >= 8 && hour < 17) return 'timezone-card-day';
    if (hour >= 17 && hour < 20) return 'timezone-card-dusk';
    return 'timezone-card-night';
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${getBackgroundClass()} ${isHome ? 'ring-2 ring-primary' : ''}`}>
      <div className="absolute inset-0 bg-gradient-to-br opacity-90" />
      <div className="relative p-6">
        {isHome ? (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full bg-primary-foreground/20 text-xs font-medium timezone-card-text">
            <Home className="h-3 w-3" />
            Home
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-60 hover:opacity-100 timezone-card-button"
            onClick={() => onRemove(city.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold timezone-card-text">{city.name}</h3>
            <p className="text-sm opacity-75 timezone-card-text">{city.country}</p>
          </div>
          <div className="timezone-card-text mt-6">
            {isDay ? (
              <Sun className="h-6 w-6 animate-pulse" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <div className="text-4xl font-bold tracking-tight timezone-card-text">
            {formatTime(localTime)}
          </div>
          <div className="text-sm opacity-75 mt-1 timezone-card-text">
            {formatDate(localTime)}
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-foreground/10 overflow-hidden">
            <div 
              className="h-full bg-primary/60 transition-all duration-300"
              style={{ width: `${((hour + localTime.getMinutes() / 60) / 24) * 100}%` }}
            />
          </div>
          <span className="text-xs opacity-60 timezone-card-text">{hour}:00</span>
        </div>
      </div>
    </Card>
  );
}
