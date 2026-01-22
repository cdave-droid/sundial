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

  // Calculate work hours in timeline coordinates for a city
  const getWorkHoursInTimeline = (city: City) => {
    const localTime = getTimeInTimezone(baseTime, city.timezone);
    const localHour = localTime.getHours() + localTime.getMinutes() / 60;
    const baseHour = baseTime.getHours() + baseTime.getMinutes() / 60;
    const offset = localHour - baseHour;
    
    // Work start/end in timeline hours (0-24)
    let workStart = WORK_START - offset;
    let workEnd = WORK_END - offset;
    
    // Normalize to 0-24 range
    while (workStart < 0) workStart += 24;
    while (workEnd < 0) workEnd += 24;
    workStart = workStart % 24;
    workEnd = workEnd % 24;
    
    return { workStart, workEnd, wrapsAround: workEnd < workStart };
  };

  // Find overlapping work hours across all cities
  const findOverlap = () => {
    if (cities.length < 2) return null;
    
    // Get all work ranges in timeline coordinates
    const ranges = cities.map(city => getWorkHoursInTimeline(city));
    
    // Convert to a common format: array of [start, end] where we handle wrap-around
    // We'll check each hour slot to see if ALL cities are working
    const workingHours: number[] = [];
    
    for (let hour = 0; hour < 24; hour += 0.5) {
      const allWorking = ranges.every(range => {
        if (range.wrapsAround) {
          // Working from workStart to 24 and from 0 to workEnd
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
    
    // Find contiguous ranges
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

  const overlapSegments = findOverlap();
  const totalOverlapHours = overlapSegments 
    ? overlapSegments.reduce((sum, seg) => sum + (seg.end - seg.start), 0)
    : 0;

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            24-Hour Timeline
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Find the best meeting time across all cities
          </p>
        </div>
        {cities.length >= 2 && (
          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
            totalOverlapHours > 0 
              ? 'bg-chart-3/20 text-chart-4' 
              : 'bg-destructive/10 text-destructive'
          }`}>
            {totalOverlapHours > 0 
              ? `${totalOverlapHours}h overlap`
              : 'No overlap'
            }
          </div>
        )}
      </div>
      
      {/* Overlap indicator row */}
      {cities.length >= 2 && (
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-24 flex-shrink-0">
              <div className="font-medium text-sm text-chart-4">
                ✓ Overlap
              </div>
              <div className="text-xs text-muted-foreground">
                Best times
              </div>
            </div>
            <div className="flex-1 h-10 bg-muted/30 rounded-lg relative overflow-hidden border-2 border-chart-3/30">
              {/* Hour grid lines */}
              {HOURS.filter((_, i) => i % 6 === 0).map((hour) => (
                <div
                  key={hour}
                  className="absolute top-0 bottom-0 w-px bg-border/50"
                  style={{ left: `${(hour / 24) * 100}%` }}
                />
              ))}
              
              {/* Overlap segments */}
              {overlapSegments && overlapSegments.map((segment, idx) => (
                <div
                  key={idx}
                  className="absolute top-1 bottom-1 bg-chart-3/60 rounded animate-pulse"
                  style={{
                    left: `${(segment.start / 24) * 100}%`,
                    width: `${((segment.end - segment.start) / 24) * 100}%`,
                  }}
                />
              ))}
              
              {/* No overlap message */}
              {(!overlapSegments || overlapSegments.length === 0) && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                  No common work hours found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
      <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-6 text-xs text-muted-foreground">
        {cities.length >= 2 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-chart-3/60 rounded" />
            <span>Overlap hours</span>
          </div>
        )}
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
