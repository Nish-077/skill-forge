"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const testimonials = [
  { id: 1, text: "SkillForge helped me switch careers effortlessly!", author: "Alex M." },
  { id: 2, text: "The courses are incredibly well-structured and engaging.", author: "Sarah K." },
  { id: 3, text: "I've gained practical skills that I use daily in my job.", author: "Mike R." },
  { id: 4, text: "The community support is unparalleled. Always helpful!", author: "Emily W." },
  { id: 5, text: "SkillForge's personalized learning paths are game-changers.", author: "Chris L." },
  { id: 6, text: "I've recommended SkillForge to all my colleagues.", author: "Lisa T." },
  { id: 7, text: "The variety of courses keeps me coming back for more.", author: "Daniel F." },
  { id: 8, text: "SkillForge has accelerated my professional growth tremendously.", author: "Rachel S." },
];

const Signup = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('Email is invalid');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 400) {
        setError('User already exists');
      } else if (res.status === 201) {
        setError('');
        router.push('/login');
      } else {
        const errorMessage = await res.text();
        setError(errorMessage);
      }
    } catch (error) {
      setError('An error occurred. Please try again');
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-500 to-purple-400 flex items-center justify-center p-5">
      <div className="w-full max-w-6xl flex rounded-xl overflow-hidden shadow-2xl">
        {/* Testimonials Section */}
        <div className="w-2/3 p-8 glass">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Learning Community</h2>
          <div className="grid grid-cols-2 gap-4">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: testimonial.id * 0.1 }}
                className="bg-white bg-opacity-20 p-4 rounded-lg"
              >
                <p className="text-white mb-2">&quot;{testimonial.text}&quot;</p>
                <p className="text-white font-semibold">- {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Signup Form Section */}
        <div className="w-1/3 bg-white p-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-8"
          >
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 translate-y-6">Create your account</h2>
              <p className="mt-2 text-sm text-gray-600 translate-y-6">Start your personalized learning journey today</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px translate-y-6">
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm password</label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between translate-y-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I accept the <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
                  </label>
                </div>
              </div>

              <div className='translate-y-4'>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center text-sm text-red-600"
              >
                {error}
              </motion.p>
            )}

            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log in
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;