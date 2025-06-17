import React from 'react';
import { useAuth } from '../contexts/auth-context';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const PatientLayout = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'personnel_administratif';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userRole={userRole} />
      <main className="pt-20 pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;