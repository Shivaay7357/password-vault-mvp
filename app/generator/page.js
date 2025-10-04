'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import PasswordGenerator from '../../components/PasswordGenerator';
import { authAPI } from '../../lib/auth';

export default function GeneratorPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  const handlePasswordGenerated = (password) => {
    // This could be used to automatically save to vault or show additional options
    console.log('Password generated:', password);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Password Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create strong, secure passwords with customizable options
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
          
          {!user && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Want to save passwords?
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Register an account to save your generated passwords securely in the vault.
                    </p>
                    <div className="mt-2">
                      <a 
                        href="/register" 
                        className="font-medium text-yellow-800 hover:text-yellow-900 underline"
                      >
                        Create Account →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
