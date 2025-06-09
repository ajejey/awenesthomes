'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from './AuthProvider';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHostMode, setIsHostMode] = useState(false);
  const router = useRouter();
  
  // Set host mode based on path when component mounts
  useEffect(() => {
    const path = window.location.pathname;
    setIsHostMode(path.startsWith('/host'));
  }, []);
  
  // Toggle between host and guest modes
  const toggleHostMode = () => {
    const newMode = !isHostMode;
    setIsHostMode(newMode);
    
    // Redirect to appropriate dashboard based on mode
    if (newMode) {
      router.push('/host/properties');
    } else {
      router.push('/');
    }
    
    // Close the menu after toggling
    setIsMenuOpen(false);
  };


  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-blue-600 font-bold text-2xl" style={{ fontFamily: 'var(--font-poppins)' }}>AweNestHomes</span>
            </Link>
          </div>

          {/* Middle - Search Button (Mobile) */}
          <div className="md:hidden flex-1 flex justify-center">
            <button 
              className="group p-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center space-x-2 text-sm text-gray-700"
              onClick={() => {
                // Scroll to search section on mobile
                document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Where to?</span>
            </button>
          </div>

          {/* Right - User Menu */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              {/* Host/Guest Mode Toggle - Only visible for logged in users */}
              {user && (user.role === 'host' || user.role === 'admin') && (
                <button 
                  onClick={toggleHostMode}
                  className={`flex items-center px-4 py-2 rounded-full transition-all ${isHostMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <span className="text-sm font-medium">
                    {isHostMode ? 'Switch to Guest' : 'Switch to Host'}
                  </span>
                </button>
              )}
              
              {/* Host Link */}
              {user?.role === 'host' ? (
                <Link href="/host/properties" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Host your home
                </Link>
              ) : (
                <Link href="/become-a-host" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Become a host
                </Link>
              )}
            </div>

            <div className="ml-4 relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 border border-gray-200 rounded-full p-1 pl-3 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="bg-gray-500 text-white rounded-full p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 divide-y divide-gray-100"
                >
                  {!user ? (
                    <div>
                      <Link href="/auth/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Log in
                      </Link>
                      <Link href="/auth/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign up
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* User Profile Section */}
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      
                      {/* Account Management */}
                      <div className="py-1">
                        <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Account settings
                          </div>
                        </Link>
                        <Link href="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            My bookings
                          </div>
                        </Link>
                        <Link href="/wishlists" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Saved properties
                          </div>
                        </Link>
                      </div>
                    </>
                  )}
                  
                  {/* Host Section */}
                  <div className="py-1">
                    {/* Host/Guest Mode Toggle - Mobile */}
                    {user && (user.role === 'host' || user.role === 'admin') && (
                      <button 
                        onClick={toggleHostMode} 
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          {isHostMode ? 'Switch to Guest mode' : 'Switch to Host mode'}
                        </div>
                      </button>
                    )}
                    
                    {user?.role === 'host' ? (
                      <Link href="/host/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Manage listings
                        </div>
                      </Link>
                    ) : (
                      <Link href="/become-a-host" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Become a host
                        </div>
                      </Link>
                    )}
                  </div>
                  
                  {/* Help & Logout */}
                  <div className="py-1">
                    <Link href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Help
                      </div>
                    </Link>
                    {user && (
                      <button 
                        onClick={() => logout()} 
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </div>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
