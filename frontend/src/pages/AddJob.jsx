import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const navigate = useNavigate(); // Хуудас шилжүүлэхэд ашиглана
  const [loading, setLoading] = useState(false);

  // Формын мэдээллийг хадгалах State
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    employerName: '',
    salary: '',
    salaryType: 'цаг',
  });

  // Оролтын утга өөрчлөгдөхөд State-ийг шинэчлэх
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Форм илгээх үед ажиллах функц
  const handleSubmit = async (e) => {
    e.preventDefault(); // Хуудсыг дахин ачааллахыг зогсоох
    setLoading(true);

    try {
      // Backend рүү POST хүсэлт илгээх (Шинэ зар нэмэх)
      await axios.post('http://localhost:5000/api/jobs', formData);
      alert('Ажлын зар амжилттай нэмэгдлээ!');
      navigate('/'); // Амжилттай болсны дараа Нүүр хуудас руу шилжих
    } catch (error) {
      console.error('Зар нэмэхэд алдаа гарлаа:', error);
      alert('Алдаа гарлаа, та мэдээллээ шалгана уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Шинэ ажлын зар оруулах</h2>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:underline text-sm font-medium">
            ← Нүүр хуудас руу буцах
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ажлын гарчиг */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ажлын гарчиг</label>
            <input 
              type="text" name="title" required
              value={formData.title} onChange={handleChange}
              placeholder="Жнь: Текст орчуулах оюутан ажилд авна"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ангилал */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ажлын ангилал</label>
              <input 
                type="text" name="category" required
                value={formData.category} onChange={handleChange}
                placeholder="Жнь: Орчуулга"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Ажил олгогчийн нэр */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ажил олгогчийн нэр</label>
              <input 
                type="text" name="employerName" required
                value={formData.employerName} onChange={handleChange}
                placeholder="Жнь: Батдорж / ХХК"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Цалин */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Цалингийн хэмжээ (₮)</label>
              <input 
                type="number" name="salary" required
                value={formData.salary} onChange={handleChange}
                placeholder="Жнь: 45000"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Цалингийн төрөл */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Цалин бодох төрөл</label>
              <select 
                name="salaryType" 
                value={formData.salaryType} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="цаг">Цагаар</option>
                <option value="өдөр">Өдрөөр</option>
                <option value="төсөл">Төслөөр</option>
              </select>
            </div>
          </div>

          {/* Илгээх товч */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold rounded-lg px-4 py-3 hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? 'Илгээж байна...' : 'Зар нийтлэх'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddJob;