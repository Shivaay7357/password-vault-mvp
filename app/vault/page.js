'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import VaultItem from '../../components/VaultItem';
import VaultForm from '../../components/VaultForm';
import { authAPI } from '../../lib/auth';
import api from '../../lib/auth';
import { encryptionUtils, createVaultItem, updateVaultItem } from '../../lib/encryption';

export default function VaultPage() {
  const [user, setUser] = useState(null);
  const [vaultItems, setVaultItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
    setUser(currentUser);
    loadVaultItems();
  }, []);

  const loadVaultItems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/vault');
      const items = response.data.map(item => {
        try {
          const decryptedData = encryptionUtils.decrypt(item.encryptedData);
          return { ...decryptedData, _id: item._id };
        } catch (error) {
          console.error('Error decrypting item:', error);
          return null;
        }
      }).filter(item => item !== null);
      
      setVaultItems(items);
    } catch (error) {
      console.error('Error loading vault items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSaveItem = async (formData) => {
    try {
      const encryptedData = encryptionUtils.encrypt(formData);
      
      if (editingItem) {
        // Update existing item
        await api.put(`/vault/${editingItem._id}`, { encryptedData });
        setVaultItems(prev => prev.map(item => 
          item._id === editingItem._id 
            ? { ...formData, _id: editingItem._id }
            : item
        ));
      } else {
        // Create new item
        const response = await api.post('/vault', { encryptedData });
        const newItem = { ...formData, _id: response.data._id };
        setVaultItems(prev => [...prev, newItem]);
      }
      
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving vault item:', error);
      alert('Failed to save item. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await api.delete(`/vault/${itemId}`);
      setVaultItems(prev => prev.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting vault item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleCopyPassword = (password, type) => {
    // Auto-clear clipboard after 15 seconds
    setTimeout(() => {
      navigator.clipboard.writeText('');
    }, 15000);
  };

  const filteredItems = vaultItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access your vault.</p>
          <a 
            href="/login" 
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Password Vault</h1>
            <p className="text-gray-600 mt-2">
              Securely store and manage your passwords
            </p>
          </div>
          <button
            onClick={handleAddItem}
            className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
          >
            Add New Item
          </button>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search vault items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredItems.length} of {vaultItems.length} items
            </div>
          </div>
        </div>

        {/* Vault Items */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading vault items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No items found' : 'Your vault is empty'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Add your first password to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddItem}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <VaultItem
                key={item._id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onCopy={handleCopyPassword}
              />
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <VaultForm
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
