import React, { useState } from 'react';
import { Calendar, Users, FileText, Activity } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Charts from '../components/Charts';

const Dashboard = ({ userRole }) => {
  const [stats] = useState({
    rendezVous: 12,
    patients: 48,
    examens: 6,
    urgences: 3
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p className="text-gray-600">Aperçu de vos activités aujourd'hui</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Rendez-vous" value={stats.rendezVous} color="text-blue-600" Icon={Calendar} />
        <StatsCard title="Patients" value={stats.patients} color="text-green-600" Icon={Users} />
        <StatsCard title="Examens" value={stats.examens} color="text-purple-600" Icon={FileText} />
        <StatsCard title="Urgences" value={stats.urgences} color="text-red-600" Icon={Activity} />
      </div>

      <Charts />
    </div>
  );
};

export default Dashboard;