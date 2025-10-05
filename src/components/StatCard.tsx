import React from 'react';

type StatCardProps = {
  title: string;
  value?: number | string;
  trend?: string; // e.g. "+12% this month"
  icon?: React.ReactNode;
  className?: string;
};

export const StatCard: React.FC<StatCardProps> = ({ title, value = 0, trend, icon, className }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className || ''}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {trend}
            </span>
          </div>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800 text-white">
        {icon}
      </div>
    </div>
  </div>
);
