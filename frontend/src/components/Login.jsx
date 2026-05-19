import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async(data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', data);
      const user = response.data.user;
      
      // Save session info
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);
      
      // Redirect based on role
      if (user.role === 'doctor' || user.role === 'admin') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'An error occurred during login');
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-[#f4f7fb] p-2 relative overflow-hidden">
      {/* Decorative background elements to simulate the office/clinical environment blur in the image */}
      <div className="absolute inset-0 w-full h-full opacity-40">
         <div className="absolute right-1/4 top-0 w-1/3 h-full bg-blue-100/50 skew-x-12 transform blur-3xl"></div>
         <div className="absolute left-1/4 top-0 w-1/4 h-full bg-slate-200/50 -skew-x-12 transform blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-[420px] bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 text-sm">Access your personalized health insights</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800 text-left">
              Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 text-left">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-gray-800">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  pattern: {
                    value: /^(?=[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                    message:
                      'Must start with capital letter, include a number, special character, and be at least 6 characters',
                  },
                })}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 text-left">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0057b7] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        
        <p className='text-center text-sm text-gray-600 mt-6'>Don't have account? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">Signup</Link></p>
        
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-gray-500">
            Are you a medical professional? <Link to="/doctor-login" className="text-blue-600 hover:text-blue-700 font-semibold">Doctor Portal</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;