import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Wifi, Utensils, Snowflake, Car, Dumbbell, Camera, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePg } from '../hooks/usePgs';
import { useCreateBooking } from '../hooks/useBookings';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import { PgGridSkeleton } from '../components/Skeleton';

const AMENITY_ICONS = {
  wifi: Wifi, food: Utensils, ac: Snowflake, parking: Car,
  gym: Dumbbell, cctv: Camera, powerBackup: Zap,
};

export default function PgDetail() {
  const { id } = useParams();
  const { data: pg, isLoading } = usePg(id);
  const { isAuthenticated, user } = useAuthStore();
  const createBooking = useCreateBooking();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dates, setDates] = useState({ startDate: '', endDate: '' });

  if (isLoading) return <div className="max-w-5xl mx-auto px-4 py-8"><PgGridSkeleton count={1} /></div>;
  if (!pg) return <div className="max-w-5xl mx-auto px-4 py-8">PG not found.</div>;

  const handleBook = () => {
    if (!isAuthenticated) return toast.error('Please log in to book a room');
    if (user.role !== 'TENANT') return toast.error('Only tenants can book rooms');
    if (!selectedRoom) return toast.error('Select a room type first');
    if (!dates.startDate || !dates.endDate) return toast.error('Select your move-in and move-out dates');

    createBooking.mutate({ roomId: selectedRoom.id, ...dates });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Photo gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6 rounded-xl overflow-hidden">
        {(pg.images?.length ? pg.images : [{ imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688' }])
          .slice(0, 3)
          .map((img, i) => (
            <img key={i} src={img.imageUrl} alt={pg.name} className="h-64 w-full object-cover" />
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold">{pg.name}</h1>
          <p className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mt-1">
            <MapPin size={16} /> {pg.address}, {pg.city}, {pg.state} - {pg.pincode}
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{pg.description}</p>

          {/* Amenities */}
          <h2 className="font-semibold mt-6 mb-3">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pg.amenities &&
              Object.entries(pg.amenities)
                .filter(([key, val]) => val === true)
                .map(([key]) => {
                  const Icon = AMENITY_ICONS[key] || Wifi;
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm capitalize bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                      <Icon size={16} className="text-primary-600" /> {key}
                    </div>
                  );
                })}
          </div>

          {/* Available rooms */}
          <h2 className="font-semibold mt-6 mb-3">Available Rooms</h2>
          <div className="space-y-3">
            {pg.rooms?.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                disabled={room.availableCount <= 0}
                className={`w-full text-left p-4 rounded-lg border flex justify-between items-center disabled:opacity-50 disabled:cursor-not-allowed
                  ${selectedRoom?.id === room.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-600/10' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <div>
                  <p className="font-medium">{room.roomType}</p>
                  <p className="text-sm text-gray-500">{room.availableCount} bed(s) available</p>
                </div>
                <p className="font-semibold text-primary-600">₹{room.rent.toLocaleString('en-IN')}/mo</p>
              </button>
            ))}
          </div>

          {/* Reviews */}
          <h2 className="font-semibold mt-6 mb-3">Reviews</h2>
          {pg.reviews?.length ? (
            <div className="space-y-3">
              {pg.reviews.map((r) => (
                <div key={r.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-1 text-yellow-500 mb-1">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          )}
        </div>

        {/* Booking sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 sticky top-20">
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-2xl font-bold text-primary-600 mb-4">
              ₹{pg.rentStartingFrom.toLocaleString('en-IN')}/mo
            </p>

            <label className="text-sm font-medium block mb-1">Move-in date</label>
            <input
              type="date"
              value={dates.startDate}
              onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
              className="w-full px-3 py-2 mb-3 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
            <label className="text-sm font-medium block mb-1">Move-out date</label>
            <input
              type="date"
              value={dates.endDate}
              onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
              className="w-full px-3 py-2 mb-4 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />

            <Button onClick={handleBook} isLoading={createBooking.isPending} className="w-full">
              Request Booking
            </Button>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
              <p className="font-medium text-gray-700 dark:text-gray-300">Owner</p>
              <p>{pg.owner?.user?.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
