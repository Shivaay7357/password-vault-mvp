'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PasswordGenerator from '../components/PasswordGenerator';
import { authAPI } from '../lib/auth';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Secure Password Vault
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate strong passwords and store them securely with client-side encryption. 
            Your passwords are encrypted before they reach our servers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PasswordGenerator />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Strong password generation with customizable options</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Client-side encryption for maximum security</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Auto-clear clipboard after 15 seconds</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Search and organize your passwords</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Secure authentication with JWT</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">Mobile-responsive design</span>
              </li>
            </ul>
            
            {!user && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <p className="text-blue-800 text-sm">
                  <strong>Getting Started:</strong> Register an account to start saving your passwords securely in the vault.
                </p>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="/generator" 
                className="bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors text-center font-medium"
              >
                Open Generator
              </a>
              <a 
                href="/vault" 
                className="bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors text-center font-medium"
              >
                View Vault
              </a>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors font-medium"
              >
                Generate New Password
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
