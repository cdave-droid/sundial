import { useRef } from 'react';
import { City, getTimeInTimezone } from '@/lib/timezones';
import { Card } from '@/components/ui/card';
import { Home } from 'lucide-react';

interface TimelineViewProps {
  cities: City[];
  homeCity: City;
  baseTime: Date;
  onTimeSelect: (date: Date) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WORK_START = 9;
const WORK_END = 17;

export function TimelineView({ cities, homeCity, baseTime, onTimeSelect }: TimelineViewProps) {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Order cities with home city first, with null safety
  const orderedCities = [homeCity, ...cities.filter(c => c && c.id !== homeCity?.id)];

  const getWorkHoursInTimeline = (city: City) => {
    const localTime = getTimeInTimezone(baseTime, city.timezone);
    const localHour = localTime.getHours() + localTime.getMinutes() / 60;
    const homeTime = getTimeInTimezone(baseTime, homeCity.timezone);
    const homeHour = homeTime.getHours() + homeTime.getMinutes() / 60;
    const offset = localHour - homeHour;
    
    let workStart = WORK_START - offset;
    let workEnd = WORK_END - offset;
    
    while (workStart < 0) workStart += 24;
    while (workEnd < 0) workEnd += 24;
    workStart = workStart % 24;
    workEnd = workEnd % 24;
    
    return { workStart, workEnd, wrapsAround: workEnd < workStart };
  };

  const findOverlap = () => {
    if (orderedCities.length < 2) return null;
    
    const ranges = orderedCities.map(city => getWorkHoursInTimeline(city));
    const workingHours: number[] = [];
    
    for (let hour = 0; hour < 24; hour += 0.5) {
      const allWorking = ranges.every(range => {
        if (range.wrapsAround) {
          return hour >= range.workStart || hour < range.workEnd;
        } else {
          return hour >= range.workStart && hour < range.workEnd;
        }
      });
      
      if (allWorking) {
        workingHours.push(hour);
      }
    }
    
    if (workingHours.length === 0) return null;
    
    const segments: { start: number; end: number }[] = [];
    let segmentStart = workingHours[0];
    let prevHour = workingHours[0];
    
    for (let i = 1; i < workingHours.length; i++) {
      if (workingHours[i] - prevHour > 0.5) {
        segments.push({ start: segmentStart, end: prevHour + 0.5 });
        segmentStart = workingHours[i];
      }
      prevHour = workingHours[i];
    }
    segments.push({ start: segmentStart, end: prevHour + 0.5 });
    
    return segments;
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>, city: City) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const clickedHour = Math.floor(percentage * 24);
    const clickedMinute = Math.round((percentage * 24 - clickedHour) * 60);
    
    // Calculate the time difference between the clicked city and UTC
    const cityTime = getTimeInTimezone(baseTime, city.timezone);
    const cityCurrentHour = cityTime.getHours() + cityTime.getMinutes() / 60;
    
    // Calculate how much to shift the base time
    const targetHour = clickedHour + clickedMinute / 60;
    const hourDiff = targetHour - cityCurrentHour;
    
    // Create new date by shifting the base time
    const newDate = new Date(baseTime.getTime() + hourDiff * 60 * 60 * 1000);
    onTimeSelect(newDate);
  };

  const overlapSegments = findOverlap();
  const totalOverlapHours = overlapSegments 
    ? overlapSegments.reduce((sum, seg) => sum + (seg.end - seg.start), 0)
    : 0;

  // Get current position based on home city time
  const homeTime = getTimeInTimezone(baseTime, homeCity.timezone);
  const selectedHour = homeTime.getHours() + homeTime.getMinutes() / 60;
  const selectedPosition = (selectedHour / 24) * 100;

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            24-Hour Timeline
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Click anywhere on the timeline to select a meeting time
          </p>
        </div>
      </div>
      
      
      {/* Hour labels */}
      <div className="flex mb-2 ml-28 text-xs text-muted-foreground">
        {HOURS.filter((_, i) => i % 3 === 0).map((hour) => (
          <div 
            key={hour} 
            className="flex-1"
          >
            {hour.toString().padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Timeline rows */}
      <div className="space-y-3">
        {orderedCities.map((city, index) => {
          const localTime = getTimeInTimezone(baseTime, city.timezone);
          const localHour = localTime.getHours();
          const localMinute = localTime.getMinutes();
          const currentPosition = ((localHour + localMinute / 60) / 24) * 100;
          
          const homeLocalTime = getTimeInTimezone(baseTime, homeCity.timezone);
          const homeHour = homeLocalTime.getHours() + homeLocalTime.getMinutes() / 60;
          const offset = (localHour + localMinute / 60) - homeHour;
          
          let workStartPos = WORK_START - offset;
          let workEndPos = WORK_END - offset;
          
          while (workStartPos < 0) workStartPos += 24;
          while (workEndPos < 0) workEndPos += 24;
          workStartPos = workStartPos % 24;
          workEndPos = workEndPos % 24;
          
          const workStartPercent = (workStartPos / 24) * 100;
          const workWidth = workEndPos > workStartPos 
            ? ((workEndPos - workStartPos) / 24) * 100
            : ((24 - workStartPos + workEndPos) / 24) * 100;
          
          const wrapsAround = workEndPos < workStartPos;
          const isHome = city.id === homeCity.id;

          return (
            <div key={city.id} className="flex items-center gap-4">
              <div className="w-28 flex-shrink-0">
                <div className={`font-medium text-sm truncate flex items-center gap-1.5 ${isHome ? 'text-primary' : 'text-foreground'}`}>
                  {isHome && <Home className="h-3.5 w-3.5 flex-shrink-0" />}
                  {city.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {localHour.toString().padStart(2, '0')}:{localMinute.toString().padStart(2, '0')}
                  {isHome && <span className="ml-1 text-primary">(You)</span>}
                </div>
              </div>
              
              <div 
                ref={isHome ? timelineRef : undefined}
                className={`flex-1 h-8 bg-muted/30 rounded-lg relative overflow-hidden cursor-pointer hover:bg-muted/40 transition-colors ${isHome ? 'ring-2 ring-primary/30' : ''}`}
                onClick={(e) => handleTimelineClick(e, city)}
              >
                {HOURS.filter((_, i) => i % 6 === 0).map((hour) => (
                  <div
                    key={hour}
                    className="absolute top-0 bottom-0 w-px bg-border/50"
                    style={{ left: `${(hour / 24) * 100}%` }}
                  />
                ))}
                
                {!wrapsAround ? (
                  <div
                    className="absolute top-1 bottom-1 bg-chart-1/40 rounded"
                    style={{
                      left: `${workStartPercent}%`,
                      width: `${workWidth}%`,
                    }}
                  />
                ) : (
                  <>
                    <div
                      className="absolute top-1 bottom-1 bg-chart-1/40 rounded-l"
                      style={{
                        left: `${workStartPercent}%`,
                        width: `${100 - workStartPercent}%`,
                      }}
                    />
                    <div
                      className="absolute top-1 bottom-1 bg-chart-1/40 rounded-r"
                      style={{
                        left: 0,
                        width: `${(workEndPos / 24) * 100}%`,
                      }}
                    />
                  </>
                )}
                
                {/* Current time marker */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-primary z-10 transition-all duration-150"
                  style={{ left: `${currentPosition}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                </div>
                
                {/* Night overlay */}
                <div
                  className="absolute top-0 bottom-0 bg-foreground/10 rounded-l-lg pointer-events-none"
                  style={{ left: 0, width: `${(6 / 24) * 100}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 bg-foreground/10 rounded-r-lg pointer-events-none"
                  style={{ left: `${(20 / 24) * 100}%`, right: 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Home className="h-3 w-3 text-primary" />
          <span>Your home city</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-1/40 rounded" />
          <span>Work hours (9-5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-foreground/10 rounded" />
          <span>Night time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-primary rounded" />
          <span>Selected time</span>
        </div>
      </div>
    </Card>
  );
}
