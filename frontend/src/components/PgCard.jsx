import { Link } from 'react-router-dom';
import { MapPin, Wifi, Utensils } from 'lucide-react';

export default function PgCard({ pg }) {
  const coverImage = pg.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688';

  return (
    <Link
      to={`/pgs/${pg.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow"
    >
      <img src={coverImage} alt={pg.name} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">{pg.name}</h3>
        <p className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <MapPin size={14} /> {pg.city}, {pg.state}
        </p>
        <div className="flex items-center gap-3 mt-2 text-gray-500 dark:text-gray-400">
          {pg.amenities?.wifi && <Wifi size={16} />}
          {pg.amenities?.food && <Utensils size={16} />}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-primary-600 dark:text-primary-500 font-bold">
            ₹{pg.rentStartingFrom?.toLocaleString('en-IN')}/mo
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {pg.genderType}
          </span>
        </div>
      </div>
    </Link>
  );
}
