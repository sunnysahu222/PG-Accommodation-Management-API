import { Link } from 'react-router-dom';
import { Building2, BedDouble, ClipboardList } from 'lucide-react';
import { usePgs } from '../../hooks/usePgs';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/Button';

export default function OwnerDashboard() {
  const { user } = useAuthStore();
  // Note: in a fuller build this would be a dedicated "my PGs" endpoint;
  // here we reuse getAll since the demo owner only has a handful of listings.
  const { data: allPgs, isLoading } = usePgs({});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.name.split(' ')[0]}</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your PG listings and bookings</p>
        </div>
        <Link to="/owner/pgs/new"><Button>+ Add New PG</Button></Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Building2} label="Total Listings" value={isLoading ? '—' : allPgs?.length || 0} />
        <StatCard icon={BedDouble} label="Total Beds" value={isLoading ? '—' : allPgs?.reduce((s, p) => s + (p.totalBeds || 0), 0)} />
        <StatCard icon={ClipboardList} label="Available Beds" value={isLoading ? '—' : allPgs?.reduce((s, p) => s + (p.availableBeds || 0), 0)} />
      </div>

      <h2 className="font-semibold mb-3">Your Listings</h2>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : !allPgs?.length ? (
        <p className="text-gray-500">No listings yet — add your first PG to get started.</p>
      ) : (
        <div className="space-y-3">
          {allPgs.map((pg) => (
            <Link
              key={pg.id}
              to={`/owner/pgs/${pg.id}/edit`}
              className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl shadow p-4"
            >
              <div>
                <p className="font-medium">{pg.name}</p>
                <p className="text-sm text-gray-500">{pg.city} — {pg.availableBeds}/{pg.totalBeds} beds available</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                pg.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                pg.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {pg.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center gap-3">
      <div className="p-3 bg-primary-50 dark:bg-primary-600/20 rounded-lg text-primary-600">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
