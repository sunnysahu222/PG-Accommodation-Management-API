import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { usePgs } from '../hooks/usePgs';
import PgCard from '../components/PgCard';
import { PgGridSkeleton } from '../components/Skeleton';
import Button from '../components/Button';

const POPULAR_CITIES = ['Bangalore', 'Pune', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi'];

export default function Landing() {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const { data: featuredPgs, isLoading } = usePgs({}); // first page of approved PGs, used as "Featured"

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(city ? `/search?city=${encodeURIComponent(city)}` : '/search');
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Find Your Perfect PG</h1>
          <p className="text-primary-100 text-lg mb-8">
            Verified PGs with the amenities you actually care about — across every major city.
          </p>

          <form onSubmit={handleSearch} className="flex bg-white rounded-xl p-2 shadow-lg max-w-xl mx-auto">
            <div className="flex items-center px-3 text-gray-400">
              <MapPin size={18} />
            </div>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search by city..."
              className="flex-1 px-2 py-2 text-gray-900 focus:outline-none"
            />
            <Button type="submit" className="flex items-center gap-2">
              <Search size={16} /> Search
            </Button>
          </form>
        </div>
      </section>

      {/* Popular locations */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-4">Popular Locations</h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map((c) => (
            <button
              key={c}
              onClick={() => navigate(`/search?city=${encodeURIComponent(c)}`)}
              className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm hover:border-primary-500 hover:text-primary-600"
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* All PGs */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-16">
        <h2 className="text-xl font-semibold mb-4">All PGs</h2>
        {isLoading ? (
          <PgGridSkeleton />
        ) : featuredPgs?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPgs.map((pg) => (
              <PgCard key={pg.id} pg={pg} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No listings yet — check back soon, or run the seed script.</p>
        )}
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-gray-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-8 text-center">What our tenants say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Aarav', text: 'Found a great PG near my office within a day. The filters made it so easy.' },
              { name: 'Priya', text: 'Booking and approval was smooth — no back and forth calls needed.' },
              { name: 'Rohan', text: 'Loved being able to see real amenities before even visiting in person.' },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">"{t.text}"</p>
                <p className="text-sm font-medium">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
