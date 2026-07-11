import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'TENANT' });
  const register = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register.mutate(form);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-1">Create an account</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Join as a tenant or list your property</p>

        {/* Role toggle */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {['TENANT', 'OWNER'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setForm({ ...form, role })}
              className={`py-2 rounded-lg text-sm font-medium border ${
                form.role === role
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300'
              }`}
            >
              {role === 'TENANT' ? "I'm looking for a PG" : "I'm a PG Owner"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Phone (optional)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" isLoading={register.isPending} className="w-full mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}
