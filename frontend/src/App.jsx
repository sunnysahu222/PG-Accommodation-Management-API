import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { router } from './routes';
import { useUIStore } from './store/uiStore';

// One QueryClient for the whole app — created once, outside the component,
// so it isn't recreated (and its cache wiped) on every re-render.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000, // data is considered "fresh" for 30s before a refetch is triggered
    },
  },
});

export default function App() {
  const darkMode = useUIStore((state) => state.darkMode);

  // Tailwind's darkMode: 'class' strategy needs the 'dark' class present
  // on <html> itself — this effect keeps that in sync with our Zustand state.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
