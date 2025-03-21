'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  // Pre-fill with default user credentials
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Dummy user data - in a real app this would be in a database
  const dummyUsers = [
    { email: 'user@example.com', password: 'password123' },
    { email: 'admin@lakshya.com', password: 'admin123' },
    { email: 'test@test.com', password: 'test123' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      // Check if user exists in dummy data
      const user = dummyUsers.find(
        user => user.email === email && user.password === password
      );

      if (user) {
        // In a real app, you would set authentication tokens/cookies here
        console.log('Login successful');
        router.push('/analysis'); // Redirect to home page after login
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Lakshya <span className="text-green-700">Health</span>
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="block text-gray-700 font-medium">
                Password
              </label>
              <a href="#" className="text-sm text-green-700 hover:text-green-800">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-green-700 text-white font-bold rounded-lg shadow-lg hover:bg-green-800 transition-all transform hover:scale-105 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/" className="text-green-700 hover:text-green-800 font-medium">
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}