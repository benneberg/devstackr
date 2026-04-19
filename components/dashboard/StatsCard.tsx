import React from 'react';
import { Link } from 'react-router-dom';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  iconColorClass?: string;
  to?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend, iconColorClass = "text-gray-600 bg-gray-100", to }) => {
  const content = (
    <div className="bg-white border border-gray-100 p-6 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-blue-100 group">
      <div>
        <h3 className="text-4xl font-bold text-gray-900 mb-1 tracking-tight group-hover:text-blue-600 transition-colors">{value}</h3>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{label}</p>
        {trend && <p className="text-[10px] text-green-600 mt-2 font-bold bg-green-50 px-1.5 py-0.5 rounded w-fit">{trend}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${iconColorClass}`}>
        {icon}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{content}</Link>;
  }

  return content;
};
