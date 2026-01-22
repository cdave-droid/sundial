import { useState } from 'react';
import { City, popularCities } from '@/lib/timezones';
import { TimezoneCard } from '@/components/TimezoneCard';
import { CitySelector } from '@/components/CitySelector';
import { TimeInput } from '@/components/TimeInput';
import { TimelineView } from '@/components/TimelineView';
import { HomeCitySelector } from '@/components/HomeCitySelector';
import { EarthGlobe } from '@/components/EarthGlobe';
import { Particles } from '@/components/ui/particles';
import { Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
const Index = () => {
  const [homeCity, setHomeCity] = useState<City | null>(null);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [baseTime, setBaseTime] = useState(new Date());
  const handleSetHomeCity = (city: City) => {
    setHomeCity(city);
    // Add famous default cities (NYC, London, LA) excluding the home city
    const famousCityNames = ['New York', 'London', 'Los Angeles'];
    const defaults = popularCities.filter(
      c => famousCityNames.includes(c.name) && c.id !== city.id
    );
    setSelectedCities(defaults);
  };
  const handleAddCity = (city: City) => {
    if (city.id !== homeCity?.id) {
      setSelectedCities([...selectedCities, city]);
    }
  };
  const handleRemoveCity = (id: string) => {
    setSelectedCities(selectedCities.filter(city => city.id !== id));
  };

  // Show home city selector if not set
  if (!homeCity) {
    return <HomeCitySelector onSelect={handleSetHomeCity} />;
  }

  // All cities including home
  const allCities = [homeCity, ...selectedCities.filter(c => c.id !== homeCity.id)];
  return <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Particle background layers */}
      <Particles className="fixed inset-0 z-0 h-full w-full" quantity={150} color="#f59e0b" size={0.6} staticity={30} ease={80} />
      <Particles className="fixed inset-0 z-0 h-full w-full" quantity={50} color="#ffffff" size={0.4} staticity={60} ease={100} />
      {/* Vignette overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none" style={{
      background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(9, 9, 11, 0.4) 70%, rgba(9, 9, 11, 0.8) 100%)'
    }} />
      
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EarthGlobe size={40} />
              <div>
                <h1 className="text-2xl font-bold text-white" style={{
                fontFamily: "'Dancing Script', cursive"
              }}>Sundial</h1>
                <p className="text-sm text-amber-400/80">Synchronize your life</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-amber-500" />
              <span className="text-zinc-400">Home:</span>
              <span className="font-medium text-white">{homeCity.name}</span>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white hover:bg-amber-500/10" onClick={() => setHomeCity(null)}>
                Change
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section with Globe */}
        <section className="mb-12">
          <div className="flex flex-col items-center gap-8">
            {/* Globe - centered at top */}
            <div className="flex-shrink-0">
              <EarthGlobe size={320} cities={allCities} homeCity={homeCity} className="mx-auto" />
            </div>
            
            {/* Text content - centered below globe */}
            <div className="text-center">
              <h2 
                className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-amber-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]"
                style={{
                  backgroundSize: '200% 100%',
                }}
              >
                Synchronize the Perfect Meeting Time
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Schedule meetings across timezones</span>
              </div>
            </div>
          </div>
        </section>

        {/* Time Input Section */}
        <section className="bg-zinc-900/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-amber-500/20 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Set Your Meeting Time
          </h3>
          <TimeInput value={baseTime} onChange={setBaseTime} />
        </section>

        {/* Cities Grid */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Your Cities ({allCities.length})
            </h3>
            <CitySelector selectedCities={allCities} onAddCity={handleAddCity} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Home city card - always first */}
            <TimezoneCard key={homeCity.id} city={homeCity} baseTime={baseTime} onRemove={() => {}} isHome />
            {/* Other cities */}
            {selectedCities.filter(c => c.id !== homeCity.id).map(city => <TimezoneCard key={city.id} city={city} baseTime={baseTime} onRemove={handleRemoveCity} />)}
          </div>
        </section>

        {/* Timeline View */}
        <section className="mb-8">
          <TimelineView cities={selectedCities} homeCity={homeCity} baseTime={baseTime} onTimeSelect={setBaseTime} />
        </section>

        {/* Tips Section */}
        <section className="bg-zinc-900/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/20">
          <h3 className="font-semibold text-amber-400 mb-3">💡 Tips</h3>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>• Click anywhere on the timeline to quickly select a meeting time based on each city</li>
            <li>• Your home city is always shown at the top of the timeline</li>
            
            
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 bg-zinc-900/80 backdrop-blur-md py-6 mt-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-lg mb-1" style={{
          fontFamily: "'Dancing Script', cursive"
        }}>Sundial</p>
          <p className="text-sm text-amber-400/80">Synchronize your life</p>
        </div>
      </footer>
    </div>;
};
export default Index;