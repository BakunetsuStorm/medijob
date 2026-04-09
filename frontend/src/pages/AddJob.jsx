import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    employerName: '',
    salary: '',
    salaryType: 'цаг',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Шинээр нэмэгдсэн: Цалингийн хяналт (Validation) ---
  const getMinSalary = (type) => {
    if (type === 'цаг') return 4000;
    if (type === 'өдөр') return 32000;
    return 50000; // Төслөөр
  };

  const minRequired = getMinSalary(formData.salaryType);
  const isSalaryTooLow = formData.salary !== '' && Number(formData.salary) < minRequired;
  // --------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Хэрэв санамсаргүйгээр илгээх гэж оролдвол зогсоох
    if (isSalaryTooLow) {
      alert(`Цалингийн хэмжээ доод тал нь ${minRequired.toLocaleString()}₮ байх ёстой.`);
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/jobs', formData);
      alert('Ажлын зар амжилттай нэмэгдлээ!');
      navigate('/');
    } catch (error) {
      console.error('Зар нэмэхэд алдаа гарлаа:', error);
      alert('Алдаа гарлаа, та мэдээллээ шалгана уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      
      {/* Container */}
      <div className="max-w-3xl mx-auto">
        
        {/* Top Navigation */}
        <div className="mb-6">
          <Link to="/" className="text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors flex items-center gap-2 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Нүүр хуудас
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          
          {/* Card Header */}
          <div className="bg-gray-900 px-8 py-10 sm:px-12">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Шинэ зар оруулах</h2>
            <p className="text-gray-400 font-medium text-sm">
              Мянга мянган ур чадвартай мэргэжилтнүүдэд ажлын байраа нээлттэй болгох.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-8">
            
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">Ерөнхий мэдээлэл</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ажлын гарчиг</label>
                  <input 
                    type="text" 
                    name="title" 
                    required
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="Жнь: Текст орчуулах оюутан ажилд авна"
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ажлын ангилал</label>
                    <input 
                      type="text" 
                      name="category" 
                      required
                      value={formData.category} 
                      onChange={handleChange}
                      placeholder="Жнь: Орчуулга, Дизайн..."
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ажил олгогчийн нэр</label>
                    <input 
                      type="text" 
                      name="employerName" 
                      required
                      value={formData.employerName} 
                      onChange={handleChange}
                      placeholder="Жнь: Батдорж / ХХК"
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Compensation */}
            <div>
              <div className="flex justify-between items-end border-b border-gray-100 pb-2 mb-5">
                <h3 className="text-lg font-bold text-gray-900">Цалингийн мэдээлэл</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Цалингийн хэмжээ (₮)</label>
                  <input 
                    type="number" 
                    name="salary" 
                    required
                    value={formData.salary} 
                    onChange={handleChange}
                    placeholder={`Доод тал нь ${minRequired.toLocaleString()}₮`}
                    className={`block w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all sm:text-sm ${
                      isSalaryTooLow 
                        ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-blue-600/20 focus:border-blue-600'
                    }`}
                  />
                  {/* Алдааны мессеж */}
                  {isSalaryTooLow && (
                    <p className="mt-2 text-sm text-red-500 font-bold flex items-center gap-1.5 animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                      {formData.salaryType === 'цаг' && "Хуулийн дагуу цагийн хөлс доод тал нь 4,000₮."}
                      {formData.salaryType === 'өдөр' && "Өдрийн цалин доод тал нь 32,000₮ байна."}
                      {formData.salaryType === 'төсөл' && "Төслийн хөлс доод тал нь 50,000₮ байна."}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Цалин бодох төрөл</label>
                  <div className="relative">
                    <select 
                      name="salaryType" 
                      value={formData.salaryType} 
                      onChange={handleChange}
                      className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm cursor-pointer"
                    >
                      <option value="цаг">Цагаар</option>
                      <option value="өдөр">Өдрөөр</option>
                      <option value="төсөл">Төслөөр</option>
                    </select>
                    {/* Custom Select Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={loading || isSalaryTooLow}
                className={`w-full sm:w-auto px-8 py-3.5 font-bold rounded-xl transition-all ${
                  isSalaryTooLow
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5'
                }`}
              >
                {loading ? 'Илгээж байна...' : 'Ажлын зар нийтлэх'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;