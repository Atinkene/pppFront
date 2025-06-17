import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const chartData = [
  { name: 'Lun', consultations: 12, examens: 8 },
  { name: 'Mar', consultations: 15, examens: 12 },
  { name: 'Mer', consultations: 8, examens: 6 },
  { name: 'Jeu', consultations: 20, examens: 15 },
  { name: 'Ven', consultations: 18, examens: 10 },
  { name: 'Sam', consultations: 5, examens: 3 },
  { name: 'Dim', consultations: 2, examens: 1 }
];

const pieData = [
  { name: 'Consultations', value: 45, color: '#3B82F6' },
  { name: 'Examens', value: 30, color: '#10B981' },
  { name: 'Urgences', value: 15, color: '#F59E0B' },
  { name: 'Chirurgies', value: 10, color: '#EF4444' }
];

const Charts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Activité de la semaine</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="consultations" fill="#3B82F6" />
            <Bar dataKey="examens" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Répartition des activités</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;