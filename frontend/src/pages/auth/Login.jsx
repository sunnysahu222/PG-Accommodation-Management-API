import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const login = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate(form);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Log in to continue</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" isLoading={login.isPending} className="w-full mt-2">
            Log In
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-medium">Sign up</Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
          <p className="font-medium mb-1">Demo accounts (after seeding the DB):</p>
          <p>tenant@pgplatform.com / password123</p>
          <p>owner@pgplatform.com / password123</p>
          <p>admin@pgplatform.com / password123</p>
        </div>
      </div>
    </div>
  );
}
