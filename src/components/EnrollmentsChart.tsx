import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const enrollments = [
  { course: 'React', value: 85 },
  { course: 'JS Basics', value: 92 },
  { course: 'Python', value: 78 },
  { course: 'Web Design', value: 65 },
];

export const EnrollmentsChart: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h4 className="text-lg font-semibold text-gray-900 mb-4">Course Enrollments (%)</h4>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={enrollments} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="course" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
