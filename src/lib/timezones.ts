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
  // UTC-12
  { id: '1', name: 'Baker Island', country: 'US Minor Outlying Islands', timezone: 'Etc/GMT+12', offset: -12, lat: 0.1936, lng: -176.4769 },
  // UTC-11
  { id: '2', name: 'Pago Pago', country: 'American Samoa', timezone: 'Pacific/Pago_Pago', offset: -11, lat: -14.2756, lng: -170.7020 },
  // UTC-10
  { id: '3', name: 'Honolulu', country: 'USA', timezone: 'Pacific/Honolulu', offset: -10, lat: 21.3069, lng: -157.8583 },
  // UTC-9.5
  { id: '4', name: 'Taiohae', country: 'French Polynesia', timezone: 'Pacific/Marquesas', offset: -9.5, lat: -8.9167, lng: -140.1000 },
  // UTC-9
  { id: '5', name: 'Anchorage', country: 'USA', timezone: 'America/Anchorage', offset: -9, lat: 61.2181, lng: -149.9003 },
  // UTC-8
  { id: '6', name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', offset: -8, lat: 34.0522, lng: -118.2437 },
  { id: '7', name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', offset: -8, lat: 49.2827, lng: -123.1207 },
  // UTC-7
  { id: '8', name: 'Denver', country: 'USA', timezone: 'America/Denver', offset: -7, lat: 39.7392, lng: -104.9903 },
  { id: '9', name: 'Phoenix', country: 'USA', timezone: 'America/Phoenix', offset: -7, lat: 33.4484, lng: -112.0740 },
  // UTC-6
  { id: '10', name: 'Chicago', country: 'USA', timezone: 'America/Chicago', offset: -6, lat: 41.8781, lng: -87.6298 },
  { id: '11', name: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City', offset: -6, lat: 19.4326, lng: -99.1332 },
  // UTC-5
  { id: '12', name: 'New York', country: 'USA', timezone: 'America/New_York', offset: -5, lat: 40.7128, lng: -74.006 },
  { id: '13', name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', offset: -5, lat: 43.6532, lng: -79.3832 },
  { id: '14', name: 'Lima', country: 'Peru', timezone: 'America/Lima', offset: -5, lat: -12.0464, lng: -77.0428 },
  // UTC-4
  { id: '15', name: 'Santiago', country: 'Chile', timezone: 'America/Santiago', offset: -4, lat: -33.4489, lng: -70.6693 },
  { id: '16', name: 'Caracas', country: 'Venezuela', timezone: 'America/Caracas', offset: -4, lat: 10.4806, lng: -66.9036 },
  // UTC-3.5
  { id: '17', name: "St. John's", country: 'Canada', timezone: 'America/St_Johns', offset: -3.5, lat: 47.5615, lng: -52.7126 },
  // UTC-3
  { id: '18', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', offset: -3, lat: -23.5505, lng: -46.6333 },
  { id: '19', name: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires', offset: -3, lat: -34.6037, lng: -58.3816 },
  // UTC-2
  { id: '20', name: 'Fernando de Noronha', country: 'Brazil', timezone: 'America/Noronha', offset: -2, lat: -3.8547, lng: -32.4247 },
  // UTC-1
  { id: '21', name: 'Praia', country: 'Cape Verde', timezone: 'Atlantic/Cape_Verde', offset: -1, lat: 14.9315, lng: -23.5125 },
  { id: '22', name: 'Azores', country: 'Portugal', timezone: 'Atlantic/Azores', offset: -1, lat: 37.7412, lng: -25.6756 },
  // UTC+0
  { id: '23', name: 'London', country: 'UK', timezone: 'Europe/London', offset: 0, lat: 51.5074, lng: -0.1278 },
  { id: '24', name: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik', offset: 0, lat: 64.1466, lng: -21.9426 },
  { id: '25', name: 'Accra', country: 'Ghana', timezone: 'Africa/Accra', offset: 0, lat: 5.6037, lng: -0.1870 },
  // UTC+1
  { id: '26', name: 'Paris', country: 'France', timezone: 'Europe/Paris', offset: 1, lat: 48.8566, lng: 2.3522 },
  { id: '27', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', offset: 1, lat: 52.52, lng: 13.405 },
  { id: '28', name: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos', offset: 1, lat: 6.5244, lng: 3.3792 },
  { id: '73', name: 'Bari', country: 'Italy', timezone: 'Europe/Rome', offset: 1, lat: 41.1171, lng: 16.8719 },
  { id: '74', name: 'Rome', country: 'Italy', timezone: 'Europe/Rome', offset: 1, lat: 41.9028, lng: 12.4964 },
  { id: '75', name: 'Milan', country: 'Italy', timezone: 'Europe/Rome', offset: 1, lat: 45.4642, lng: 9.1900 },
  { id: '76', name: 'Naples', country: 'Italy', timezone: 'Europe/Rome', offset: 1, lat: 40.8518, lng: 14.2681 },
  // UTC+2
  { id: '29', name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', offset: 2, lat: 30.0444, lng: 31.2357 },
  { id: '30', name: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg', offset: 2, lat: -26.2041, lng: 28.0473 },
  { id: '31', name: 'Athens', country: 'Greece', timezone: 'Europe/Athens', offset: 2, lat: 37.9838, lng: 23.7275 },
  // UTC+3
  { id: '32', name: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow', offset: 3, lat: 55.7558, lng: 37.6173 },
  { id: '33', name: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi', offset: 3, lat: -1.2921, lng: 36.8219 },
  { id: '34', name: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh', offset: 3, lat: 24.7136, lng: 46.6753 },
  // UTC+3.5
  { id: '35', name: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran', offset: 3.5, lat: 35.6892, lng: 51.3890 },
  // UTC+4
  { id: '36', name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', offset: 4, lat: 25.2048, lng: 55.2708 },
  { id: '37', name: 'Baku', country: 'Azerbaijan', timezone: 'Asia/Baku', offset: 4, lat: 40.4093, lng: 49.8671 },
  // UTC+4.5
  { id: '38', name: 'Kabul', country: 'Afghanistan', timezone: 'Asia/Kabul', offset: 4.5, lat: 34.5553, lng: 69.2075 },
  // UTC+5
  { id: '39', name: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi', offset: 5, lat: 24.8607, lng: 67.0011 },
  { id: '40', name: 'Tashkent', country: 'Uzbekistan', timezone: 'Asia/Tashkent', offset: 5, lat: 41.2995, lng: 69.2401 },
  // UTC+5.5
  { id: '41', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5, lat: 19.076, lng: 72.8777 },
  { id: '42', name: 'Delhi', country: 'India', timezone: 'Asia/Kolkata', offset: 5.5, lat: 28.7041, lng: 77.1025 },
  // UTC+5.75
  { id: '43', name: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu', offset: 5.75, lat: 27.7172, lng: 85.3240 },
  // UTC+6
  { id: '44', name: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka', offset: 6, lat: 23.8103, lng: 90.4125 },
  { id: '45', name: 'Almaty', country: 'Kazakhstan', timezone: 'Asia/Almaty', offset: 6, lat: 43.2220, lng: 76.8512 },
  // UTC+6.5
  { id: '46', name: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon', offset: 6.5, lat: 16.8661, lng: 96.1951 },
  // UTC+7
  { id: '47', name: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', offset: 7, lat: 13.7563, lng: 100.5018 },
  { id: '48', name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta', offset: 7, lat: -6.2088, lng: 106.8456 },
  { id: '49', name: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', offset: 7, lat: 10.8231, lng: 106.6297 },
  // UTC+8
  { id: '50', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', offset: 8, lat: 1.3521, lng: 103.8198 },
  { id: '51', name: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong', offset: 8, lat: 22.3193, lng: 114.1694 },
  { id: '52', name: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', offset: 8, lat: 31.2304, lng: 121.4737 },
  { id: '53', name: 'Perth', country: 'Australia', timezone: 'Australia/Perth', offset: 8, lat: -31.9505, lng: 115.8605 },
  { id: '54', name: 'Manila', country: 'Philippines', timezone: 'Asia/Manila', offset: 8, lat: 14.5995, lng: 120.9842 },
  // UTC+8.75
  { id: '55', name: 'Eucla', country: 'Australia', timezone: 'Australia/Eucla', offset: 8.75, lat: -31.6833, lng: 128.8833 },
  // UTC+9
  { id: '56', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', offset: 9, lat: 35.6762, lng: 139.6503 },
  { id: '57', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', offset: 9, lat: 37.5665, lng: 126.9780 },
  // UTC+9.5
  { id: '58', name: 'Darwin', country: 'Australia', timezone: 'Australia/Darwin', offset: 9.5, lat: -12.4634, lng: 130.8456 },
  { id: '59', name: 'Adelaide', country: 'Australia', timezone: 'Australia/Adelaide', offset: 9.5, lat: -34.9285, lng: 138.6007 },
  // UTC+10
  { id: '60', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', offset: 10, lat: -33.8688, lng: 151.2093 },
  { id: '61', name: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne', offset: 10, lat: -37.8136, lng: 144.9631 },
  { id: '62', name: 'Brisbane', country: 'Australia', timezone: 'Australia/Brisbane', offset: 10, lat: -27.4698, lng: 153.0251 },
  { id: '63', name: 'Port Moresby', country: 'Papua New Guinea', timezone: 'Pacific/Port_Moresby', offset: 10, lat: -9.4438, lng: 147.1803 },
  // UTC+10.5
  { id: '64', name: 'Lord Howe Island', country: 'Australia', timezone: 'Australia/Lord_Howe', offset: 10.5, lat: -31.5553, lng: 159.0821 },
  // UTC+11
  { id: '65', name: 'Nouméa', country: 'New Caledonia', timezone: 'Pacific/Noumea', offset: 11, lat: -22.2758, lng: 166.4580 },
  { id: '66', name: 'Solomon Islands', country: 'Solomon Islands', timezone: 'Pacific/Guadalcanal', offset: 11, lat: -9.4456, lng: 160.0022 },
  // UTC+12
  { id: '67', name: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland', offset: 12, lat: -36.8485, lng: 174.7633 },
  { id: '68', name: 'Fiji', country: 'Fiji', timezone: 'Pacific/Fiji', offset: 12, lat: -18.1416, lng: 178.4419 },
  // UTC+12.75
  { id: '69', name: 'Chatham Islands', country: 'New Zealand', timezone: 'Pacific/Chatham', offset: 12.75, lat: -43.9531, lng: -176.5401 },
  // UTC+13
  { id: '70', name: 'Apia', country: 'Samoa', timezone: 'Pacific/Apia', offset: 13, lat: -13.8333, lng: -171.7500 },
  { id: '71', name: "Nuku'alofa", country: 'Tonga', timezone: 'Pacific/Tongatapu', offset: 13, lat: -21.2114, lng: -175.1998 },
  // UTC+14
  { id: '72', name: 'Kiritimati', country: 'Kiribati', timezone: 'Pacific/Kiritimati', offset: 14, lat: 1.8721, lng: -157.4278 },
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
