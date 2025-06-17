import React from 'react';
import { useAuth } from '../contexts/auth-context';
import { roleConfigs } from '../utils';

const AccountPage = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'patient';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Mon compte</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <p className="text-lg">{user?.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="text-lg">{user?.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rôle</label>
          <p className="text-lg">{roleConfigs[userRole]?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;