import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

import Landing from '../pages/Landing';
import SearchPgs from '../pages/SearchPgs';
import PgDetail from '../pages/PgDetail';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';

import MyBookings from '../pages/tenant/MyBookings';

import OwnerDashboard from '../pages/owner/OwnerDashboard';
import PgForm from '../pages/owner/PgForm';
import OwnerBookings from '../pages/owner/OwnerBookings';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminListings from '../pages/admin/AdminListings';
import AdminUsers from '../pages/admin/AdminUsers';

const ownerLinks = [
  { to: '/owner/dashboard', label: 'Overview' },
  { to: '/owner/pgs/new', label: 'Add PG' },
  { to: '/owner/bookings', label: 'Booking Requests' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/listings', label: 'Pending Listings' },
  { to: '/admin/users', label: 'Users' },
];

// createBrowserRouter (not <Routes> JSX) is the modern React Router v6.4+
// pattern — it gives data-loading features we're not using yet, but it's
// the recommended baseline so the app isn't built on a path you'd have to migrate off later.
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/search', element: <SearchPgs /> },
      { path: '/pgs/:id', element: <PgDetail /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        path: '/bookings',
        element: (
          <ProtectedRoute roles={['TENANT']}>
            <MyBookings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute roles={['OWNER']}>
        <DashboardLayout links={ownerLinks} />
      </ProtectedRoute>
    ),
    children: [
      { path: '/owner/dashboard', element: <OwnerDashboard /> },
      { path: '/owner/pgs/new', element: <PgForm /> },
      { path: '/owner/pgs/:id/edit', element: <PgForm /> },
      { path: '/owner/bookings', element: <OwnerBookings /> },
    ],
  },
  {
    element: (
      <ProtectedRoute roles={['ADMIN']}>
        <DashboardLayout links={adminLinks} />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin/dashboard', element: <AdminDashboard /> },
      { path: '/admin/listings', element: <AdminListings /> },
      { path: '/admin/users', element: <AdminUsers /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);
