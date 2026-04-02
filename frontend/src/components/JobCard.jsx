import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      
      {/* 1. Ажлын зураг (Cover Image) */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={job.coverImage || `https://via.placeholder.com/400x200?text=Job+Image`} 
          alt={job.title} 
          className="w-full h-full object-cover"
        />
        {/* Ангилал / Category Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm uppercase tracking-wide">
          {job.category}
        </div>
      </div>

      {/* 2. Картын мэдээлэл */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Гарчиг */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-snug">
          {job.title}
        </h3>

        {/* Ажил олгогчийн мэдээлэл */}
        <div className="flex items-center gap-3 mb-6">
          <img 
            src={job.employerAvatar || `https://via.placeholder.com/40`} 
            alt={job.employerName} 
            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
          />
          <span className="text-sm font-medium text-gray-600">
            {job.employerName}
          </span>
        </div>

        {/* 3. Картын хөл хэсэг (Үнэлгээ & Цалин) */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          
          {/* Үнэлгээ (Rating) */}
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold text-gray-800">{job.rating}</span>
          </div>

          {/* Цалин */}
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">
              {job.salary.toLocaleString()}₮
            </span>
            <span className="text-sm text-gray-500">/{job.salaryType}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default JobCard;