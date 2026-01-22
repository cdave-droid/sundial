export interface City {
  id: string;
  name: string;
  country: string;
  timezone: string;
  offset: number; // offset in hours from UTC
  lat: number;
  lng: number;
}

export const popularCities: City[] = [
  { id: '1', name: 'New York', country: 'USA', timezone: 'America/New_York', offset: -5, lat: 40.7128, lng: -74.006 },
  { id: '2', name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', offset: -8, lat: 34.0522, lng: -118.2437 },
  { id: '3', name: 'London', country: 'UK', timezone: 'Europe/London', offset: 0, lat: 51.5074, lng: -0.1278 },
  { id: '4', name: 'Paris', country: 'France', timezone: 'Europe/Paris', offset: 1, lat: 48.8566, lng: 2.3522 },
  { id: '5', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', offset: 1, lat: 52.52, lng: 13.405 },
  { id: '6', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', offset: 9, lat: 35.6762, lng: 139.6503 },
  { id: '7', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', offset: 11, lat: -33.8688, lng: 151.2093 },
  { id: '8', name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', offset: 4, lat: 25.2048, lng: 55.2708 },
  { id: '9', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', offset: 8, lat: 1.3521, lng: 103.8198 },
  { id: '10', name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', offset: 8, lat: 22.3193, lng: 114.1694 },
  { id: '11', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5, lat: 19.076, lng: 72.8777 },
  { id: '12', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', offset: -3, lat: -23.5505, lng: -46.6333 },
  { id: '13', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', offset: -5, lat: 43.6532, lng: -79.3832 },
  { id: '14', name: 'Chicago', country: 'USA', timezone: 'America/Chicago', offset: -6, lat: 41.8781, lng: -87.6298 },
  { id: '15', name: 'Denver', country: 'USA', timezone: 'America/Denver', offset: -7, lat: 39.7392, lng: -104.9903 },
];

export function getTimeInTimezone(baseDate: Date, timezone: string): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(baseDate);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '0';
  
  return new Date(
    parseInt(getPart('year')),
    parseInt(getPart('month')) - 1,
    parseInt(getPart('day')),
    parseInt(getPart('hour')),
    parseInt(getPart('minute')),
    parseInt(getPart('second'))
  );
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function isDaytime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 6 && hour < 20;
}

export function getTimeOfDayGradient(date: Date): string {
  const hour = date.getHours();
  
  if (hour >= 5 && hour < 8) {
    return 'from-amber-200 via-orange-300 to-rose-300'; // Dawn
  } else if (hour >= 8 && hour < 17) {
    return 'from-sky-300 via-blue-400 to-sky-500'; // Day
  } else if (hour >= 17 && hour < 20) {
    return 'from-orange-400 via-rose-400 to-purple-500'; // Dusk
  } else {
    return 'from-indigo-900 via-purple-900 to-slate-900'; // Night
  }
}
