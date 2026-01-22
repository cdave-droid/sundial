import { useState, useRef, useEffect } from 'react';
import { City, popularCities } from '@/lib/timezones';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { SpiralAnimation } from './SpiralAnimation';
import { EarthGlobe } from './EarthGlobe';
import { Particles } from './ui/particles';
interface HomeCitySelectorProps {
  onSelect: (city: City) => void;
}
export function HomeCitySelector({
  onSelect
}: HomeCitySelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filteredCities = search.length > 0 ? popularCities.filter(city => city.name.toLowerCase().includes(search.toLowerCase()) || city.country.toLowerCase().includes(search.toLowerCase())).slice(0, 6) : [];
  const handleSelect = (city: City) => {
    setSearch(city.name);
    setIsOpen(false);
    onSelect(city);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredCities.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => prev < filteredCities.length - 1 ? prev + 1 : 0);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : filteredCities.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCities[highlightedIndex]) {
        handleSelect(filteredCities[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && !inputRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Spiral Animation Background */}
      <SpiralAnimation />
      
      {/* Particles overlay - gold/amber theme */}
      <Particles className="absolute inset-0 z-[1]" quantity={80} staticity={30} ease={80} size={0.6} color="#f59e0b" vx={0} vy={0} />
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 text-center relative">
            <span 
              className="bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent animate-pulse"
              style={{
                WebkitTextStroke: '2px #f59e0b',
                textShadow: '0 0 30px rgba(245, 158, 11, 0.5)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            >
              SUNDIAL
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Find the perfect meeting time across timezones
          </p>
        </div>
        
        {/* Simple Entry Box */}
        <div className="w-full max-w-md">
          <label className="block text-sm font-medium text-muted-foreground mb-2 text-center">
            Enter your home city to get started
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input ref={inputRef} type="text" placeholder="Search for a city..." value={search} onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
          }} onFocus={() => setIsOpen(true)} onKeyDown={handleKeyDown} className="pl-12 pr-4 h-14 text-lg bg-card/90 backdrop-blur-md border-primary/30 shadow-xl rounded-xl focus:ring-2 focus:ring-primary/50" autoFocus autoComplete="off" />
            
            {/* Dropdown */}
            {isOpen && filteredCities.length > 0 && <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl overflow-hidden z-50">
                {filteredCities.map((city, index) => <button key={city.id} onClick={() => handleSelect(city)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${index === highlightedIndex ? 'bg-primary/20 text-foreground' : 'hover:bg-primary/10 text-foreground'}`}>
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-muted-foreground">{city.country}</div>
                    </div>
                  </button>)}
              </div>}
          </div>
          
          {/* Hint text */}
          <p className="text-xs text-muted-foreground text-center mt-3">
            Start typing to see suggestions
          </p>
        </div>
      </div>
    </div>;
}