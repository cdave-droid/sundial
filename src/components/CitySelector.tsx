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
        <Button variant="outline" className="gap-2 border-dashed border-2 h-12">
          <Plus className="h-5 w-5" />
          Add City
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a City</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid gap-2 max-h-[300px] overflow-y-auto">
          {filteredCities.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No cities found</p>
          ) : (
            filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors text-left"
              >
                <div>
                  <div className="font-medium">{city.name}</div>
                  <div className="text-sm text-muted-foreground">{city.country}</div>
                </div>
                <div className="text-sm text-muted-foreground">
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
