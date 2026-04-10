import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  // 1. Ангиллаас хамаарч өөр өөр өнгө гаргах функц
  const getCategoryGradient = (category) => {
    const gradients = {
      'Вэб хөгжүүлэлт': 'from-blue-600 to-cyan-500',
      'График дизайн': 'from-purple-600 to-pink-500',
      'Орчуулга': 'from-emerald-500 to-teal-400',
      'Маркетинг': 'from-orange-500 to-yellow-400',
      'Ачигч': 'from-slate-600 to-slate-800', // Таны зураг дээрх ангилалд зориулав
    };
    return gradients[category] || 'from-indigo-600 to-blue-800'; // Default өнгө
  };

  // 2. Ажил олгогчийн нэрний эхний үсгийг авах (Жнь: "Tech ХХК" -> "T")
  const employerInitial = job.employerName ? job.employerName.charAt(0).toUpperCase() : 'M';

  const gradientClass = getCategoryGradient(job.category);

  return (
    <Link 
      to={`/job/${job._id}`} 
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer block"
    >
      
      {/* 1. Cover Image (ОДОО ЦЭВЭР CSS GRADIENT БОЛСОН) */}
      <div className={`relative h-48 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {/* Гоё хээ нэмэх (Subtle Pattern) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm uppercase tracking-wider">
          {job.category}
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {job.title}
        </h3>

        {/* Employer Info (ОДОО ЦЭВЭР REACT COMPONENT БОЛСОН) */}
        <div className="flex items-center gap-3 mb-6 mt-auto">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm bg-gray-900 border-2 border-white shadow-sm ring-1 ring-gray-100">
            {employerInitial}
          </div>
          <span className="text-sm font-semibold text-gray-600">
            {job.employerName}
          </span>
        </div>

        {/* 3. Footer */}
        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
          
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold text-yellow-700">{job.rating || "Шинэ"}</span>
          </div>

          <div className="text-right flex flex-col">
            <span className="text-xl font-black text-blue-600">
              {job.salary.toLocaleString()}₮
            </span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">/{job.salaryType}</span>
          </div>
          
        </div>
      </div>
    </Link>
  );
};

export default JobCard;