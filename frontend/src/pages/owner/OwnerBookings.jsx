import { useMyBookings, useUpdateBookingStatus } from '../../hooks/useBookings';
import Button from '../../components/Button';

// Note: reuses the same /api/bookings GET endpoint as the tenant view —
// the backend controller branches on req.user.role to decide which
// bookings to return (see bookingController.getBookings).
export default function OwnerBookings() {
  const { data: bookings, isLoading } = useMyBookings();
  const updateStatus = useUpdateBookingStatus();

  if (isLoading) return <p className="text-gray-500">Loading booking requests...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Booking Requests</h1>

      {!bookings?.length ? (
        <p className="text-gray-500">No booking requests yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{b.user.name}</p>
                <p className="text-sm text-gray-500">{b.user.email} {b.user.phone && `• ${b.user.phone}`}</p>
                <p className="text-sm text-gray-500">{b.room.roomType} — {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}</p>
              </div>

              {b.status === 'PENDING' ? (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => updateStatus.mutate({ id: b.id, status: 'APPROVED' })}
                    isLoading={updateStatus.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => updateStatus.mutate({ id: b.id, status: 'REJECTED' })}
                    isLoading={updateStatus.isPending}
                  >
                    Reject
                  </Button>
                </div>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-700">
                  {b.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
