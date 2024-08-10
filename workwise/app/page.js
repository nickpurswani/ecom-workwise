"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/authContext';
import { z } from 'zod';

// Define the schema using Zod
const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['buyer', 'seller'], 'Role is required'),
});

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const { signIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const formData = { name, email, password, role };

    // Validate form data using Zod
    const result = signupSchema.safeParse(formData);

    if (!result.success) {
      const errors = {};
      result.error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return;
    }

    try {
      const res = await fetch('https://ecom-workwise.onrender.com/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Something went wrong');
      }

      const user = await res.json();
      signIn(user.token);
      const userData = user.user;

      if (userData.role === 'seller') {
        router.push('/seller');
      } else {
        router.push('/buyer');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative p-10">
          <h2 className="text-2xl font-bold text-center text-gray-900">Sign Up</h2>
          {error && (
            <div className="p-4 text-center text-red-500 bg-red-100">
              {error}
            </div>
          )}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border-b-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.name && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border-b-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.email}</p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border-b-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 border-b-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
              {validationErrors.role && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.role}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </button>
            <a href="/login" className="block text-center text-m text-black-500 hover:underline">
              Already have an account? Login
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
