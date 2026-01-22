import { useState } from 'react';
import { City, popularCities } from '@/lib/timezones';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Home, Search, MapPin } from 'lucide-react';
import { SpiralAnimation } from './SpiralAnimation';
import { Particles } from './ui/particles';

interface HomeCitySelectorProps {
  onSelect: (city: City) => void;
}

export function HomeCitySelector({ onSelect }: HomeCitySelectorProps) {
  const [search, setSearch] = useState('');
  
  const filteredCities = popularCities.filter(
    (city) =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Spiral Animation Background */}
      <SpiralAnimation />
      
      {/* Particles overlay - gold/amber theme */}
      <Particles 
        className="absolute inset-0 z-[1]"
        quantity={80}
        staticity={30}
        ease={80}
        size={0.6}
        color="#f59e0b"
        vx={0}
        vy={0}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 bg-card/95 backdrop-blur-md border-primary/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 mb-4">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to TimeSync
            </h1>
            <p className="text-muted-foreground">
              First, select your home city to get started
            </p>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for your city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/80 border-border/50"
              autoFocus
            />
          </div>
          
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredCities.map((city) => (
              <Button
                key={city.id}
                variant="ghost"
                className="w-full justify-start h-auto py-3 px-4 hover:bg-primary/10 transition-colors"
                onClick={() => onSelect(city)}
              >
                <MapPin className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium text-foreground">{city.name}</div>
                  <div className="text-sm text-muted-foreground">{city.country}</div>
                </div>
              </Button>
            ))}
            
            {filteredCities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No cities found matching "{search}"
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
