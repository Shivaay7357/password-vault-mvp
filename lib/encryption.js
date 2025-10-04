'use client';

import CryptoJS from 'crypto-js';

// Get encryption key from environment or use a default (in production, this should be more secure)
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-encryption-key-change-in-production';

export const encryptionUtils = {
  encrypt: (data) => {
    try {
      const jsonString = JSON.stringify(data);
      const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  },

  decrypt: (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Failed to decrypt data - invalid key or corrupted data');
      }
      
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
};

// Vault item structure
export const createVaultItem = (title, username, password, notes = '') => {
  return {
    id: Date.now().toString(), // Simple ID generation
    title,
    username,
    password,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateVaultItem = (item, updates) => {
  return {
    ...item,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};
