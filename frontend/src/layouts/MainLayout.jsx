import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

// The Outlet is where React Router renders whichever page matches
// the current route. Every page automatically gets the Navbar this way,
// without each page having to import and render it manually.
export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
