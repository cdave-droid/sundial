import React, { useMemo } from 'react';
import { City } from '@/lib/timezones';

interface EarthGlobeProps {
  size?: number;
  className?: string;
  cities?: City[];
  homeCity?: City | null;
  showStars?: boolean;
}

// Convert lat/lng to x/y position on a 2D circle projection
function latLngToPosition(lat: number, lng: number, size: number): { x: number; y: number; visible: boolean } {
  // Normalize longitude to -180 to 180
  const normalizedLng = ((lng + 180) % 360) - 180;
  
  // Only show cities on the "front" hemisphere (-90 to 90 degrees longitude)
  const visible = normalizedLng >= -90 && normalizedLng <= 90;
  
  // Calculate position on the visible hemisphere
  const radius = size / 2 - 8;
  const x = (normalizedLng / 90) * radius;
  const y = -(lat / 90) * radius;
  
  // Apply perspective - pins closer to edge appear more compressed
  const edgeFactor = Math.cos((normalizedLng / 90) * (Math.PI / 2));
  
  return {
    x: x * edgeFactor + size / 2,
    y: y + size / 2,
    visible: visible && edgeFactor > 0.3
  };
}

interface CityPinProps {
  city: City;
  isHome?: boolean;
  size: number;
}

function CityPin({ city, isHome, size }: CityPinProps) {
  const position = useMemo(() => latLngToPosition(city.lat, city.lng, size), [city.lat, city.lng, size]);
  
  if (!position.visible) return null;
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Pin marker */}
      <div className={`relative flex flex-col items-center`}>
        {/* Pin dot */}
        <div 
          className={`w-2 h-2 rounded-full shadow-lg ${
            isHome 
              ? 'bg-amber-500 shadow-amber-500/50' 
              : 'bg-red-500 shadow-red-500/50'
          }`}
          style={{
            boxShadow: isHome 
              ? '0 0 8px 2px rgba(245, 158, 11, 0.6)' 
              : '0 0 6px 1px rgba(239, 68, 68, 0.5)'
          }}
        />
        {/* Label */}
        {size > 100 && (
          <div 
            className={`absolute top-3 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${
              isHome 
                ? 'bg-amber-500 text-zinc-900' 
                : 'bg-zinc-800 text-white border border-zinc-700'
            }`}
          >
            {city.name}
          </div>
        )}
      </div>
    </div>
  );
}

export function EarthGlobe({ 
  size = 40, 
  className = '', 
  cities = [], 
  homeCity,
  showStars = false 
}: EarthGlobeProps) {
  const isLarge = size > 100;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <style>
        {`
          @keyframes earthRotate {
            0% { background-position: 0 0; }
            100% { background-position: ${size}px 0; }
          }
          @keyframes twinkling {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
          @keyframes twinkling-slow {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.9; }
          }
          @keyframes twinkling-fast {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 ${size * 0.15}px ${size * 0.05}px rgba(245, 158, 11, 0.3); }
            50% { box-shadow: 0 0 ${size * 0.2}px ${size * 0.08}px rgba(245, 158, 11, 0.5); }
          }
        `}
      </style>

      {/* Stars background */}
      {showStars && (
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkling${i % 3 === 0 ? '-slow' : i % 3 === 1 ? '-fast' : ''} ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Globe container */}
      <div 
        className="relative rounded-full overflow-hidden"
        style={{ 
          width: size, 
          height: size,
          animation: 'pulse-glow 4s ease-in-out infinite',
        }}
      >
        {/* Dark space background */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #1a1a2e 0%, #0f0f1a 100%)',
          }}
        />

        {/* Earth sphere */}
        <div
          className="absolute inset-1 rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, 
                rgba(100, 200, 255, 0.15) 0%, 
                transparent 50%
              ),
              linear-gradient(135deg, 
                #1e3a5f 0%, 
                #0d1f2d 25%, 
                #1a4a3a 50%, 
                #0d2818 75%, 
                #1e3a5f 100%
              )
            `,
            backgroundSize: `${size}px ${size}px`,
            animation: `earthRotate ${isLarge ? 30 : 20}s linear infinite`,
          }}
        >
          {/* Continental shapes overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 30% 20% at 25% 35%, rgba(34, 139, 34, 0.4) 0%, transparent 70%),
                radial-gradient(ellipse 15% 25% at 55% 30%, rgba(34, 139, 34, 0.3) 0%, transparent 70%),
                radial-gradient(ellipse 25% 15% at 70% 60%, rgba(34, 139, 34, 0.35) 0%, transparent 70%),
                radial-gradient(ellipse 20% 30% at 30% 70%, rgba(34, 139, 34, 0.3) 0%, transparent 70%),
                radial-gradient(ellipse 10% 10% at 85% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 70%)
              `,
              backgroundSize: `${size}px ${size}px`,
              animation: `earthRotate ${isLarge ? 30 : 20}s linear infinite`,
            }}
          />

          {/* Ocean highlights */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 40% 30% at 60% 50%, rgba(30, 144, 255, 0.2) 0%, transparent 60%),
                radial-gradient(ellipse 30% 40% at 40% 40%, rgba(0, 100, 200, 0.15) 0%, transparent 60%)
              `,
            }}
          />
        </div>

        {/* Atmosphere glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(135, 206, 250, 0.2) 0%, transparent 50%)',
            boxShadow: `
              inset 0 0 ${size * 0.15}px ${size * 0.05}px rgba(135, 206, 250, 0.3),
              0 0 ${size * 0.1}px ${size * 0.02}px rgba(245, 158, 11, 0.2)
            `,
          }}
        />

        {/* Gold rim accent */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: 'inset 0 0 20px rgba(245, 158, 11, 0.1)',
          }}
        />

        {/* City pins */}
        {homeCity && (
          <CityPin city={homeCity} isHome size={size} />
        )}
        {cities.filter(c => c.id !== homeCity?.id).map((city) => (
          <CityPin key={city.id} city={city} size={size} />
        ))}
      </div>
    </div>
  );
}
