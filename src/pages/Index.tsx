import { useState } from 'react';
import { City, popularCities } from '@/lib/timezones';
import { TimezoneCard } from '@/components/TimezoneCard';
import { CitySelector } from '@/components/CitySelector';
import { TimeInput } from '@/components/TimeInput';
import { Globe, Clock } from 'lucide-react';

const defaultCities = popularCities.slice(0, 4);

const Index = () => {
  const [selectedCities, setSelectedCities] = useState<City[]>(defaultCities);
  const [baseTime, setBaseTime] = useState(new Date());

  const handleAddCity = (city: City) => {
    setSelectedCities([...selectedCities, city]);
  };

  const handleRemoveCity = (id: string) => {
    setSelectedCities(selectedCities.filter((city) => city.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TimeSync</h1>
              <p className="text-sm text-muted-foreground">Compare timezones instantly</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Schedule meetings across timezones</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find the Perfect Meeting Time
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select a date and time, then see it reflected across all your chosen cities. 
            Perfect for coordinating with global teams.
          </p>
        </section>

        {/* Time Input Section */}
        <section className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Set Your Meeting Time
          </h3>
          <TimeInput value={baseTime} onChange={setBaseTime} />
        </section>

        {/* Cities Grid */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Your Cities ({selectedCities.length})
            </h3>
            <CitySelector selectedCities={selectedCities} onAddCity={handleAddCity} />
          </div>
          
          {selectedCities.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No cities selected</p>
              <p className="text-sm text-muted-foreground/75">
                Add cities to start comparing timezones
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedCities.map((city) => (
                <TimezoneCard
                  key={city.id}
                  city={city}
                  baseTime={baseTime}
                  onRemove={handleRemoveCity}
                />
              ))}
            </div>
          )}
        </section>

        {/* Tips Section */}
        <section className="bg-accent/30 rounded-2xl p-6 border border-border/50">
          <h3 className="font-semibold text-foreground mb-3">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Cards show day/night status with sun and moon icons</li>
            <li>• The progress bar shows how far through the day each city is</li>
            <li>• Click "Now" to quickly set the current time</li>
            <li>• Add up to {popularCities.length} different cities to compare</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>TimeSync — Making global collaboration easier</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
