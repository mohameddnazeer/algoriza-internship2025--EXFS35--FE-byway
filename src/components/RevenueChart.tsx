import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', revenue: 6400 },
  { name: 'Feb', revenue: 7800 },
  { name: 'Mar', revenue: 9200 },
  { name: 'Apr', revenue: 8400 },
  { name: 'May', revenue: 12450 },
  { name: 'Jun', revenue: 13100 },
];

export const RevenueChart: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h4>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#rev)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
