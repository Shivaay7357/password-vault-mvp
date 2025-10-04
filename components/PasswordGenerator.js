'use client';

import { useState, useCallback } from 'react';

export default function PasswordGenerator({ onPasswordGenerated }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = '';
    
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    // Remove similar characters if requested
    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '');
    }
    
    if (charset === '') {
      alert('Please select at least one character type');
      return;
    }
    
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(newPassword);
    
    // Call the callback if provided (for saving to vault)
    if (onPasswordGenerated) {
      onPasswordGenerated(newPassword);
    }
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar, onPasswordGenerated]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
      
      // Auto-clear after 15 seconds
      setTimeout(() => {
        setPassword('');
        setCopySuccess('');
      }, 15000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Password Generator</h2>
      
      {/* Generated Password Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Generated Password
        </label>
        <div className="flex">
          <input
            type="text"
            value={password}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-gray-900 font-mono"
            placeholder="Click 'Generate Password' to create one"
          />
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {copySuccess || 'Copy'}
          </button>
        </div>
        {password && (
          <p className="text-sm text-gray-500 mt-2">
            Password will auto-clear in 15 seconds after copying
          </p>
        )}
      </div>

      {/* Length Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="4"
          max="128"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>4</span>
          <span>128</span>
        </div>
      </div>

      {/* Character Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={(e) => setIncludeUppercase(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Uppercase (A-Z)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={(e) => setIncludeLowercase(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Lowercase (a-z)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Numbers (0-9)</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Symbols (!@#$...)</span>
        </label>
      </div>

      {/* Additional Options */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={excludeSimilar}
            onChange={(e) => setExcludeSimilar(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            Exclude similar characters (0, O, 1, l, I)
          </span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
      >
        Generate Password
      </button>

      {/* Password Strength Indicator */}
      {password && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Password Strength:</span>
            <span className={`text-sm font-medium ${
              password.length < 8 ? 'text-red-600' :
              password.length < 12 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {password.length < 8 ? 'Weak' :
               password.length < 12 ? 'Medium' :
               'Strong'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                password.length < 8 ? 'bg-red-500 w-1/3' :
                password.length < 12 ? 'bg-yellow-500 w-2/3' :
                'bg-green-500 w-full'
              }`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
