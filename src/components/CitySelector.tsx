import { useState } from 'react';
import { City, popularCities } from '@/lib/timezones';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface CitySelectorProps {
  selectedCities: City[];
  onAddCity: (city: City) => void;
}

export function CitySelector({ selectedCities, onAddCity }: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const availableCities = popularCities.filter(
    city => !selectedCities.find(sc => sc.id === city.id)
  );
  
  const filteredCities = availableCities.filter(
    city =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city: City) => {
    onAddCity(city);
    setOpen(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-dashed border-2 h-12 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-500/50">
          <Plus className="h-5 w-5" />
          Add City
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-zinc-800 border-amber-500/20">
        <DialogHeader>
          <DialogTitle className="text-white">Add a City</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-500"
          />
        </div>
        <div className="grid gap-2 max-h-[300px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-amber-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-amber-500/50">
          {filteredCities.length === 0 ? (
            <p className="text-center text-zinc-500 py-4">No cities found</p>
          ) : (
            filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-500/10 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-white">{city.name}</div>
                  <div className="text-sm text-zinc-400">{city.country}</div>
                </div>
                <div className="text-sm text-amber-400/80">
                  UTC{city.offset >= 0 ? '+' : ''}{city.offset}
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
