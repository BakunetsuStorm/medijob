import React from 'react';

const JobCard = ({ job }) => {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer">
      
      {/* 1. Cover Image with Gradient Overlay */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
        <img 
          src={job.coverImage || `https://via.placeholder.com/400x200?text=Job+Image`} 
          alt={job.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-sm uppercase tracking-wider">
          {job.category}
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="p-6 flex flex-col flex-grow relative">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {job.title}
        </h3>

        {/* Employer Info */}
        <div className="flex items-center gap-3 mb-6">
          <img 
            src={job.employerAvatar || `https://via.placeholder.com/40`} 
            alt={job.employerName} 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
          />
          <span className="text-sm font-semibold text-gray-600">
            {job.employerName}
          </span>
        </div>

        {/* 3. Footer (Rating & Salary) */}
        <div className="mt-auto pt-5 border-t border-gray-100/80 flex items-center justify-between">
          
          {/* Rating */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold text-yellow-700">{job.rating}</span>
          </div>

          {/* Salary */}
          <div className="text-right flex flex-col">
            <span className="text-xl font-black text-blue-600">
              {job.salary.toLocaleString()}₮
            </span>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">/{job.salaryType}</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default JobCard;