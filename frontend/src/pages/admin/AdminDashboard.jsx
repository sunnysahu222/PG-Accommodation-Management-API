import { Users, Building2, ClipboardCheck, Hourglass } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAdmin';

export default function AdminDashboard() {
  const { data, isLoading } = useAnalytics();

  const stats = [
    { icon: Users, label: 'Tenants', value: data?.totalUsers },
    { icon: Users, label: 'Owners', value: data?.totalOwners },
    { icon: Building2, label: 'Total Listings', value: data?.totalPgs },
    { icon: ClipboardCheck, label: 'Approved Listings', value: data?.approvedPgs },
    { icon: Hourglass, label: 'Total Bookings', value: data?.totalBookings },
    { icon: Hourglass, label: 'Pending Bookings', value: data?.pendingBookings },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <s.icon size={20} className="text-primary-600 mb-2" />
            <p className="text-2xl font-bold">{isLoading ? '—' : s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
