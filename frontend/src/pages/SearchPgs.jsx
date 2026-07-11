import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePgs } from '../hooks/usePgs';
import PgCard from '../components/PgCard';
import { PgGridSkeleton } from '../components/Skeleton';

const ROOM_TYPES = ['Single', 'Double Sharing', 'Triple Sharing'];
const AMENITY_OPTIONS = ['wifi', 'food', 'ac', 'parking', 'gym', 'cctv'];

export default function SearchPgs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    gender: '',
    roomType: '',
    minBudget: '',
    maxBudget: '',
    amenities: [],
  });

  // Convert filters into the query-string shape the backend expects.
  const queryFilters = {
    ...filters,
    amenities: filters.amenities.length ? filters.amenities.join(',') : undefined,
  };

  const { data: pgs, isLoading } = usePgs(queryFilters);

  const toggleAmenity = (a) => {
    setFilters((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters sidebar */}
      <aside className="lg:col-span-1 space-y-6">
        <div>
          <label className="text-sm font-medium block mb-1">City</label>
          <input
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            placeholder="e.g. Bangalore"
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <option value="">Any</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Room Type</label>
          <select
            value={filters.roomType}
            onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <option value="">Any</option>
            {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Budget (₹/mo)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minBudget}
              onChange={(e) => setFilters({ ...filters, minBudget: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxBudget}
              onChange={(e) => setFilters({ ...filters, maxBudget: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Amenities</label>
          <div className="space-y-2">
            {AMENITY_OPTIONS.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm capitalize">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                />
                {a}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="lg:col-span-3">
        <h1 className="text-xl font-semibold mb-4">
          {isLoading ? 'Searching...' : `${pgs?.length || 0} PGs found`}
        </h1>
        {isLoading ? (
          <PgGridSkeleton />
        ) : pgs?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pgs.map((pg) => <PgCard key={pg.id} pg={pg} />)}
          </div>
        ) : (
          <p className="text-gray-500">No PGs match your filters. Try widening your search.</p>
        )}
      </div>
    </div>
  );
}
