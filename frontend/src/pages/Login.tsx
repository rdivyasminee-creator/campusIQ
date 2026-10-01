import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('admin@niiscampus.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (email || 'admin@niiscampus.com').trim().toLowerCase();
    const cleanPass = (password || 'admin123').trim();
    if (
      (cleanEmail === 'admin@niiscampus.com' || cleanEmail === 'admin@niis.ac.in' || cleanEmail === 'admin') &&
      (cleanPass === 'admin123' || cleanPass === 'admin')
    ) {
      onLogin();
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please verify your email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900 selection:bg-primary-500 selection:text-white">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Dark overlay pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

      {/* Main Centered Login Card */}
      <div className="relative z-10 w-full max-w-5xl p-4 sm:p-6 lg:p-8 flex items-center justify-center animate-fade-in-up">
        <div className="flex flex-col lg:flex-row w-full bg-white/10 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_50px_rgba(34,197,94,0.15)] overflow-hidden border border-white/20">
          
          {/* Left Side: Image & Branding inside the card */}
          <div className="lg:w-5/12 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
            <div className="absolute inset-0 bg-primary-900/90 mix-blend-multiply z-10" />
            <img src="/banner.jpg" alt="NIIS Campus" className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-1000 hover:scale-100" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/60 to-purple-800/60 z-10 mix-blend-overlay" />
            
            <div className="relative z-20 flex items-center gap-4 mb-12">
              <div className="p-2 bg-white/95 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl">
                <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full object-contain p-0.5 bg-white shadow-sm" />
              </div>
              <div>
                <span className="text-xl font-black tracking-widest text-white uppercase drop-shadow-md block">NIIS</span>
                <span className="text-xs font-semibold text-emerald-300 tracking-wider">CAMPUS INTELLIGENCE</span>
              </div>
            </div>
            
            <div className="relative z-20 mt-auto">
              <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-primary-100 uppercase tracking-wider">
                System Active
              </div>
              <h2 className="text-4xl font-extrabold leading-tight mb-4 text-white drop-shadow-lg">
                Intelligence meets <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">Sustainability.</span>
              </h2>
              <p className="text-white/80 text-base mb-6 leading-relaxed font-medium">
                Experience the next generation of campus facility management. Real-time telemetry, AI surveillance, and smart facility switches.
              </p>
            </div>
          </div>

          {/* Right Side: Integrated Form */}
          <div className="lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white/95 relative overflow-hidden">
            {/* Subtle light effect on form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full filter blur-[80px] opacity-60 pointer-events-none" />

            <div className="text-center lg:text-left mb-8 relative z-10">
              <div className="flex items-center justify-center lg:justify-start gap-3.5 mb-4">
                <img src="/logo.jpg" alt="NIIS Crest" className="w-14 h-14 rounded-full border-2 border-primary-200 shadow-md object-contain bg-white p-1" />
                <div className="text-left">
                  <h3 className="text-lg font-black text-primary-800 leading-tight">NIIS Group of Institutions</h3>
                  <p className="text-xs text-gray-500 font-semibold">Campus Facilities Intelligence &bull; Bhubaneswar</p>
                </div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tighter mb-2 drop-shadow-sm">Welcome Back</h2>
              <p className="text-gray-500 font-bold text-sm sm:text-base tracking-wide">Authenticate to access the facility dashboard.</p>
            </div>

            {error && (
              <div className="relative z-10 bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm flex items-center font-bold border border-red-100 shadow-sm animate-fade-in-up">
                <span className="mr-3 text-xl">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
              
              {/* New Role Toggle */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full max-w-sm mx-auto lg:mx-0 shadow-inner">
                <button type="button" className="flex-1 py-3 text-sm font-extrabold rounded-xl bg-white text-primary-600 shadow-sm border border-gray-200 transition-all">
                  Administrator
                </button>
                <button type="button" className="flex-1 py-3 text-sm font-bold rounded-xl text-gray-500 hover:text-gray-700 transition-all" onClick={() => alert("Staff login is currently disabled in Demo Mode.")}>
                  Staff / Faculty
                </button>
              </div>

              <div className="group">
                <label className="block text-base font-extrabold text-gray-800 mb-2 ml-1 transition-colors group-focus-within:text-primary-600 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm text-gray-900 font-bold" 
                    placeholder="admin@niiscampus.com"
                  />
                </div>
              </div>
              
              <div className="group">
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-base font-extrabold text-gray-800 transition-colors group-focus-within:text-primary-600 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-sm font-extrabold text-primary-600 hover:text-primary-500 transition-colors tracking-wide underline decoration-primary-300 underline-offset-4">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-500">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 text-lg bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm text-gray-900 font-bold tracking-widest" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mr-3 border-2 border-gray-300 rounded-md group-hover:border-primary-500 transition-colors">
                    <input type="checkbox" className="peer opacity-0 absolute w-full h-full cursor-pointer" />
                    <svg className="w-3 h-3 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    <div className="absolute inset-0 bg-primary-600 rounded-sm opacity-0 peer-checked:opacity-100 -z-10 transition-opacity"></div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 select-none">Remember me</span>
                </label>
              </div>

              <button type="submit" className="w-full relative overflow-hidden group bg-gradient-to-r from-primary-600 to-emerald-500 text-white py-4 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all font-extrabold shadow-[0_10px_20px_-10px_rgba(34,197,94,0.5)] hover:shadow-[0_10px_25px_-5px_rgba(34,197,94,0.6)] hover:-translate-y-0.5 text-lg">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Sign in to Dashboard
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-emerald-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
