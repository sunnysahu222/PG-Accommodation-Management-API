import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardLayout({ links }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto flex">
        <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-4rem)] p-4 hidden sm:block">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === link.to
                    ? 'bg-primary-50 dark:bg-primary-600/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
