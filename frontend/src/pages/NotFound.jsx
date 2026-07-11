import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="text-gray-500 mt-2 mb-6">This page doesn't exist.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  );
}
