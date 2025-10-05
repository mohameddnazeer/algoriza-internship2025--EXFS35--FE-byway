import React from 'react';
import { Link } from 'react-router-dom';

type QuickLinkProps = {
  to: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
};

export const QuickLink: React.FC<QuickLinkProps> = ({
  to, title, subtitle, icon, gradientFrom = 'from-indigo-500', gradientTo = 'to-purple-600'
}) => (
  <Link to={to} className="group">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white`}>
          {icon}
        </div>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 text-sm">{subtitle}</p>
    </div>
  </Link>
);
