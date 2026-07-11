import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useLogout } from '../hooks/useAuth';
import Button from './Button';

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardLink =
    user?.role === 'OWNER' ? '/owner/dashboard' : user?.role === 'ADMIN' ? '/admin/dashboard' : '/bookings';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          PG<span className="text-gray-900 dark:text-white">Platform</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/search" className="text-gray-700 dark:text-gray-200 hover:text-primary-600">
            Find a PG
          </Link>
          {isAuthenticated && (
            <Link to={dashboardLink} className="text-gray-700 dark:text-gray-200 hover:text-primary-600">
              {user.role === 'TENANT' ? 'My Bookings' : 'Dashboard'}
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">Hi, {user.name.split(' ')[0]}</span>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="outline">Login</Button></Link>
              <Link to="/register"><Button>Sign Up</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-200 dark:border-gray-800">
          <Link to="/search" onClick={() => setMenuOpen(false)}>Find a PG</Link>
          {isAuthenticated ? (
            <>
              <Link to={dashboardLink} onClick={() => setMenuOpen(false)}>
                {user.role === 'TENANT' ? 'My Bookings' : 'Dashboard'}
              </Link>
              <button onClick={logout} className="text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
          <button onClick={toggleDarkMode} className="text-left">
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </header>
  );
}
