import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, ArrowRight, Stethoscope, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorLogin = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/doctors/login', data);
      const doctor = response.data.doctor;
      
      // Save session info
      localStorage.setItem('userId', doctor.id);
      localStorage.setItem('userRole', doctor.role || 'doctor');
      
      // Redirect to doctor-dashboard
      navigate('/doctor-dashboard');
      
    } catch (error) {
      console.error('Doctor Login Error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'An error occurred during doctor login');
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-[#f4f7fb] p-2 relative overflow-hidden min-h-[calc(100vh-80px)]">
      {/* Decorative background elements to simulate the clinical environment blur */}
      <div className="absolute inset-0 w-full h-full opacity-40">
         <div className="absolute right-1/4 top-0 w-1/3 h-full bg-blue-100/50 skew-x-12 transform blur-3xl"></div>
         <div className="absolute left-1/4 top-0 w-1/4 h-full bg-slate-200/50 -skew-x-12 transform blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-[420px] bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Doctor Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shadow-blue-50">
            <Stethoscope className="w-8 h-8" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Clinical Workspace
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Login</h1>
          <p className="text-gray-500 text-sm">Access your clinical intelligence portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-800 text-left">
              Clinical Email Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="doctor@clinic.com"
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
            Enter Workspace
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
          <p className="text-xs text-gray-500">
            Are you a patient? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Patient Login</Link>
          </p>
          <p className="text-xs text-gray-400">
            For security, please sign out of your workspace after completing your consultations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;