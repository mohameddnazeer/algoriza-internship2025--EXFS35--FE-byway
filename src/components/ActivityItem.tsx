import React from 'react';

type ActivityItemProps = {
  title: string;
  text: string;
  time: string;
  gradientFrom?: string;
  gradientTo?: string;
  icon?: React.ReactNode;
};

export const ActivityItem: React.FC<ActivityItemProps> = ({
  title, text, time, gradientFrom = 'from-blue-50', gradientTo = 'to-indigo-50', icon
}) => (
  <div className={`flex items-start space-x-4 p-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl border border-gray-100`}>
    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{text}</p>
      <p className="text-xs text-gray-500 mt-2">{time}</p>
    </div>
  </div>
);
