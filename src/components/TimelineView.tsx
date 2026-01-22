import { City, getTimeInTimezone } from '@/lib/timezones';
import { Card } from '@/components/ui/card';

interface TimelineViewProps {
  cities: City[];
  baseTime: Date;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WORK_START = 9;
const WORK_END = 17;

export function TimelineView({ cities, baseTime }: TimelineViewProps) {
  if (cities.length === 0) return null;

  const getLocalHour = (city: City) => {
    const localTime = getTimeInTimezone(baseTime, city.timezone);
    return localTime.getHours() + localTime.getMinutes() / 60;
  };

  const getWorkHoursPosition = (city: City) => {
    const localTime = getTimeInTimezone(baseTime, city.timezone);
    const baseHour = baseTime.getHours();
    const localHour = localTime.getHours();
    const offset = localHour - baseHour;
    
    // Calculate where 9 AM local time falls on the 24h bar
    const workStart = (WORK_START + 24) % 24;
    const workEnd = (WORK_END + 24) % 24;
    
    return { workStart, workEnd };
  };

  // Find overlapping work hours
  const findOverlap = () => {
    if (cities.length < 2) return null;
    
    const workRanges = cities.map(city => {
      const localTime = getTimeInTimezone(baseTime, city.timezone);
      const hour = localTime.getHours();
      const minute = localTime.getMinutes();
      const currentLocalHour = hour + minute / 60;
      
      // Calculate the offset from base time
      const baseHour = baseTime.getHours() + baseTime.getMinutes() / 60;
      const offset = currentLocalHour - baseHour;
      
      // Work hours in terms of the timeline (base time perspective)
      const start = WORK_START - offset;
      const end = WORK_END - offset;
      
      return { start: (start + 24) % 24, end: (end + 24) % 24, city };
    });

    // Find the intersection of all work hour ranges
    let overlapStart = Math.max(...workRanges.map(r => r.start > r.end ? r.start - 24 : r.start));
    let overlapEnd = Math.min(...workRanges.map(r => r.end));
    
    if (overlapStart < overlapEnd) {
      return { start: (overlapStart + 24) % 24, end: overlapEnd };
    }
    return null;
  };

  const overlap = findOverlap();

  return (
    <Card className="p-6 bg-card border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        24-Hour Timeline
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Green bars show typical work hours (9 AM - 5 PM) in each city
      </p>
      
      {/* Hour labels */}
      <div className="flex mb-2 text-xs text-muted-foreground">
        {HOURS.filter((_, i) => i % 3 === 0).map((hour) => (
          <div 
            key={hour} 
            className="flex-1"
            style={{ marginLeft: hour === 0 ? 0 : undefined }}
          >
            {hour.toString().padStart(2, '0')}:00
          </div>
        ))}
      </div>

      {/* Timeline rows */}
      <div className="space-y-3">
        {cities.map((city) => {
          const localTime = getTimeInTimezone(baseTime, city.timezone);
          const localHour = localTime.getHours();
          const localMinute = localTime.getMinutes();
          const currentPosition = ((localHour + localMinute / 60) / 24) * 100;
          
          // Calculate work hours position on the 24h timeline
          // Work hours are 9-17 in local time, we need to show where they fall
          const baseHour = baseTime.getHours() + baseTime.getMinutes() / 60;
          const offset = (localHour + localMinute / 60) - baseHour;
          
          // Work start/end in timeline hours (0-24)
          let workStartPos = WORK_START - offset;
          let workEndPos = WORK_END - offset;
          
          // Normalize to 0-24 range
          while (workStartPos < 0) workStartPos += 24;
          while (workEndPos < 0) workEndPos += 24;
          workStartPos = workStartPos % 24;
          workEndPos = workEndPos % 24;
          
          const workStartPercent = (workStartPos / 24) * 100;
          const workWidth = workEndPos > workStartPos 
            ? ((workEndPos - workStartPos) / 24) * 100
            : ((24 - workStartPos + workEndPos) / 24) * 100;
          
          const wrapsAround = workEndPos < workStartPos;

          return (
            <div key={city.id} className="flex items-center gap-4">
              <div className="w-24 flex-shrink-0">
                <div className="font-medium text-sm text-foreground truncate">
                  {city.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {localHour.toString().padStart(2, '0')}:{localMinute.toString().padStart(2, '0')}
                </div>
              </div>
              
              <div className="flex-1 h-8 bg-muted/30 rounded-lg relative overflow-hidden">
                {/* Hour grid lines */}
                {HOURS.filter((_, i) => i % 6 === 0).map((hour) => (
                  <div
                    key={hour}
                    className="absolute top-0 bottom-0 w-px bg-border/50"
                    style={{ left: `${(hour / 24) * 100}%` }}
                  />
                ))}
                
                {/* Work hours bar */}
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
                  className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                  style={{ left: `${currentPosition}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
                </div>
                
                {/* Night overlay (before 6 AM and after 8 PM) */}
                <div
                  className="absolute top-0 bottom-0 bg-foreground/10 rounded-l-lg"
                  style={{ left: 0, width: `${(6 / 24) * 100}%` }}
                />
                <div
                  className="absolute top-0 bottom-0 bg-foreground/10 rounded-r-lg"
                  style={{ left: `${(20 / 24) * 100}%`, right: 0 }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-1/40 rounded" />
          <span>Work hours (9-5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-foreground/10 rounded" />
          <span>Night time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3 bg-primary rounded" />
          <span>Selected time</span>
        </div>
      </div>
    </Card>
  );
}
