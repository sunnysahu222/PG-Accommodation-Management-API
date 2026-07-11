import { useMyBookings, useUpdateBookingStatus } from '../../hooks/useBookings';
import Button from '../../components/Button';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  CANCELLED: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
};

export default function MyBookings() {
  const { data: bookings, isLoading } = useMyBookings();
  const updateStatus = useUpdateBookingStatus();

  if (isLoading) return <p className="text-gray-500">Loading your bookings...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {!bookings?.length ? (
        <p className="text-gray-500">No bookings yet. Go find a PG you like!</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{b.room.pg.name}</p>
                <p className="text-sm text-gray-500">{b.room.pg.city} — {b.room.roomType}</p>
                <p className="text-sm text-gray-500">
                  {new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[b.status]}`}>
                  {b.status}
                </span>
                {b.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    onClick={() => updateStatus.mutate({ id: b.id, status: 'CANCELLED' })}
                    isLoading={updateStatus.isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
