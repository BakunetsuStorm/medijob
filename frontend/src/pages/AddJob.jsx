import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LOCATION_DATA = {
  "Улаанбаатар": {
    "Багануур дүүрэг": 5,
    "Багахангай дүүрэг": 2,
    "Баянгол дүүрэг (БГД)": 34,
    "Баянзүрх дүүрэг (БЗД)": 43,
    "Налайх дүүрэг": 8,
    "Сонгинохайрхан дүүрэг (СХД)": 43,
    "Сүхбаатар дүүрэг (СБД)": 20,    
    "Хан-Уул дүүрэг (ХУД)": 25,
    "Чингэлтэй дүүрэг (ЧД)": 24
  }
};

const WEEKDAYS = ['Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба', 'Ням'];

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', category: '', employerName: '', salary: '', 
    salaryType: 'цаг', locationType: 'Зайнаас', requirements: '',
    city: 'Улаанбаатар', district: '', khoroo: '', specificAddress: '',
    isTemporary: false,
    tempStartDate: '', // 🔥 ШИНЭ: Эхлэх өдөр
    tempEndDate: '',   // 🔥 ШИНЭ: Дуусах өдөр
    isRecurring: false,  
    recurringDays: []    
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDistrictChange = (e) => setFormData({ ...formData, district: e.target.value, khoroo: '' });

  const toggleRecurringDay = (day) => {
    setFormData(prev => {
      const isSelected = prev.recurringDays.includes(day);
      return {
        ...prev,
        recurringDays: isSelected 
          ? prev.recurringDays.filter(d => d !== day) 
          : [...prev.recurringDays, day]
      };
    });
  };

  const getMinSalary = (type) => {
    if (type === 'цаг') return 4000;
    if (type === 'өдөр') return 32000;
    return 50000;
  };

  const minRequired = getMinSalary(formData.salaryType);
  const isSalaryTooLow = formData.salary !== '' && Number(formData.salary) < minRequired;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSalaryTooLow) {
      alert(`Цалингийн хэмжээ доод тал нь ${minRequired.toLocaleString()}₮ байх ёстой.`);
      return;
    }

    if (formData.isRecurring && formData.recurringDays.length === 0) {
      alert("Тогтмол давтамжтай ажил тул ядаж 1 гараг сонгоно уу!");
      return;
    }

    // 🔥 ШИНЭ ЛОГИК: 2 сонгосон өдрийг нэгтгэж текст болгох
    let finalDurationText = '';
    if (formData.isTemporary) {
      if (!formData.tempStartDate || !formData.tempEndDate) {
        alert("Түр зуурын ажлын эхлэх болон дуусах өдрийг сонгоно уу.");
        return;
      }
      if (formData.tempStartDate === formData.tempEndDate) {
        finalDurationText = `${formData.tempStartDate} (1 өдөр)`;
      } else {
        finalDurationText = `${formData.tempStartDate} -аас ${formData.tempEndDate}`;
      }
    }

    let finalLocation = '';
    if (formData.locationType !== 'Зайнаас') {
      if (!formData.district || !formData.khoroo || !formData.specificAddress) {
        alert("Байршлын мэдээллийг гүйцэд оруулна уу.");
        return;
      }
      finalLocation = `${formData.city}, ${formData.district}, ${formData.khoroo}-р хороо, ${formData.specificAddress}`;
    }

    // Backend рүү явуулах датагаа бэлдэх
    const submitData = { 
      ...formData, 
      location: finalLocation,
      durationText: finalDurationText // 🔥 Нэгтгэсэн текстээ Backend рүү явуулна
    };

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/jobs', submitData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Ажлын зар амжилттай нэмэгдлээ!');
      navigate('/');
    } catch (error) {
      console.error('Зар нэмэхэд алдаа гарлаа:', error);
      alert('Алдаа гарлаа, та мэдээллээ шалгана уу.');
    } finally {
      setLoading(false);
    }
  };

  const khorooCount = formData.district ? LOCATION_DATA["Улаанбаатар"][formData.district] : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold text-sm flex items-center gap-2 w-fit transition-colors">← Буцах</Link></div>
        <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
          
          <div className="bg-gray-900 dark:bg-black px-8 py-10 sm:px-12 border-b dark:border-gray-800">
            <h2 className="text-3xl font-black text-white mb-2">Шинэ зар оруулах</h2>
            <p className="text-gray-400 font-medium text-sm">Мянга мянган ур чадвартай мэргэжилтнүүдэд нээлттэй болгох.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
            
            {/* 1. Ерөнхий мэдээлэл */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-gray-800 pb-2">Ерөнхий мэдээлэл</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ажлын гарчиг</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Жнь: Ахлах вэб хөгжүүлэгч" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ажлын ангилал</label>
                    <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer transition-colors">
                  <option value="" disabled>-- Ангилал сонгох --</option>
                  <option value="Зөөгч, Бариста">Зөөгч, Бариста</option>
                  <option value="Касс, Худалдагч">Касс, Худалдагч</option>
                  <option value="Угтах үйлчилгээ (Ресепшн)">Угтах үйлчилгээ (Ресепшн)</option>
                  <option value="Бараа өрөгч, Агуулах">Бараа өрөгч, Агуулах</option>
                  <option value="Тогооч, Тогоочийн туслах">Тогооч, Тогоочийн туслах</option>
                  <option value="Цэвэрлэгээ, Үйлчилгээ">Цэвэрлэгээ, Үйлчилгээ</option>
                  <option value="Түгээлт, Хүргэлт">Түгээлт, Хүргэлт</option>
                  <option value="Ачигч, Хар ажил">Ачигч, Хар ажил</option>
                  <option value="Жолооч">Жолооч</option>
                  <option value="Мэдээлэл оруулагч (Data Entry)">Мэдээлэл оруулагч (Data Entry)</option>
                  <option value="Хэрэглэгчийн төв (Call Center)">Хэрэглэгчийн төв (Call Center)</option>
                  <option value="Орчуулга">Орчуулга</option>
                  <option value="Промоутер, Борлуулалт">Промоутер, Борлуулалт</option>
                  <option value="Сошиал медиа хөгжүүлэлт">Сошиал медиа хөгжүүлэлт</option>
                  <option value="Маркетинг, Олон нийттэй харилцах">Маркетинг, Олон нийттэй харилцах</option>
                  <option value="Вэб болон Апп хөгжүүлэлт">Вэб болон Апп хөгжүүлэлт</option>
                  <option value="График дизайн">График дизайн</option>
                  <option value="Видео эвлүүлэг, Зураг авалт">Видео эвлүүлэг, Зураг авалт</option>
                  <option value="Мэдээллийн технологи (IT)">Мэдээллийн технологи (IT)</option>
                  <option value="Гэрийн багш, Сургалт">Гэрийн багш, Сургалт</option>
                  <option value="Эвэнт, Арга хэмжээний туслах">Эвэнт, Арга хэмжээний туслах</option>
                  <option value="Бусад">Бусад</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ажил олгогчийн нэр</label>
                    <input type="text" name="employerName" required value={formData.employerName} onChange={handleChange} placeholder="Жнь: Tech ХХК" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Ажлын нөхцөл & Байршил */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-gray-800 pb-2">Ажлын нөхцөл & Байршил</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Ажиллах хэлбэр</label>
                  <div className="grid grid-cols-3 gap-3 md:w-1/2">
                    {['Зайнаас', 'Оффис', 'Холимог'].map((type) => (
                      <button key={type} type="button" onClick={() => setFormData({ ...formData, locationType: type })} className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${formData.locationType === type ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400" : "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#222222]"}`}>{type}</button>
                    ))}
                  </div>
                </div>

                {formData.locationType !== 'Зайнаас' && (
                  <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 space-y-5 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-400 border-b border-indigo-200/50 dark:border-indigo-800/50 pb-2"> Хаягийн мэдээлэл</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Хот / Аймаг</label>
                        <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-bold text-gray-700 transition-colors">
                          <option value="Улаанбаатар">Улаанбаатар</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Дүүрэг</label>
                        <select name="district" value={formData.district} onChange={handleDistrictChange} className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer transition-colors">
                          <option value="" disabled>-- Дүүрэг сонгох --</option>
                          {Object.keys(LOCATION_DATA["Улаанбаатар"]).map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Хороо</label>
                        <select name="khoroo" value={formData.khoroo} onChange={handleChange} disabled={!formData.district} className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer disabled:bg-gray-100 disabled:dark:bg-[#111111] disabled:cursor-not-allowed transition-colors">
                          <option value="" disabled>-- Хороо --</option>
                          {Array.from({ length: khorooCount }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}-р хороо</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Гудамж, Барилга, Тоот</label>
                      <input type="text" name="specificAddress" value={formData.specificAddress} onChange={handleChange} placeholder="Жнь: Тэнгис кино театрын ард..." className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-colors" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ажлын дэлгэрэнгүй & Шаардлага</label>
                  <textarea name="requirements" required value={formData.requirements} onChange={handleChange} rows="5" placeholder="Хийгдэх ажлууд болон тавигдах шаардлагуудыг дэлгэрэнгүй бичнэ үү..." className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-y transition-colors"></textarea>
                </div>
              </div>
            </div>

            {/* 3. Цалин */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 border-b border-gray-100 dark:border-gray-800 pb-2">Цалингийн мэдээлэл</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Цалингийн хэмжээ (₮)</label>
                  <input type="number" name="salary" required value={formData.salary} onChange={handleChange} placeholder={`Доод тал нь ${minRequired.toLocaleString()}₮`} className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border rounded-xl focus:ring-2 outline-none transition-all ${isSalaryTooLow ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-600'}`} />
                  {isSalaryTooLow && <p className="mt-2 text-xs text-red-500 font-bold">Хуулийн дагуу цалингийн доод хэмжээнд хүрээгүй байна.</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Цалин бодох төрөл</label>
                  <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer transition-colors">
                    <option value="цаг">Цагаар</option>
                    <option value="өдөр">Өдрөөр</option>
                    <option value="төсөл">Төслөөр</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ⏱️ Түр зуурын ажил - ХУАНЛИ (CALENDAR) СОНГОЛТТОЙ БОЛСОН */}
            <div className="p-5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <input 
                  type="checkbox" 
                  id="isTemp"
                  checked={formData.isTemporary} 
                  onChange={(e) => setFormData({...formData, isTemporary: e.target.checked})} 
                  className="w-5 h-5 text-orange-600 rounded cursor-pointer" 
                />
                <label htmlFor="isTemp" className="font-black text-orange-800 dark:text-orange-400 cursor-pointer">
                   Энэ бол түр зуурын / богино хугацааны ажил (Эвэнт, 1-3 хоног г.м)
                </label>
              </div>
              
              {formData.isTemporary && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Ажиллах хугацааг сонгоно уу</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Эхлэх өдөр</label>
                      <input 
                        type="date" 
                        value={formData.tempStartDate} 
                        onChange={(e) => setFormData({...formData, tempStartDate: e.target.value})} 
                        className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-orange-200 dark:border-orange-700/50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all cursor-pointer"
                        required={formData.isTemporary}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Дуусах өдөр</label>
                      <input 
                        type="date" 
                        value={formData.tempEndDate} 
                        min={formData.tempStartDate} // Эхлэх өдрөөс өмнөхийг сонгуулахгүй байх хамгаалалт
                        onChange={(e) => setFormData({...formData, tempEndDate: e.target.value})} 
                        className="w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-orange-200 dark:border-orange-700/50 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all cursor-pointer"
                        required={formData.isTemporary}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 🔄 Тогтмол давтамжтай ажил */}
            <div className="p-5 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/50 rounded-xl mb-6 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <input 
                  type="checkbox" 
                  id="isRecurr"
                  checked={formData.isRecurring} 
                  onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})} 
                  className="w-5 h-5 text-teal-600 rounded cursor-pointer" 
                />
                <label htmlFor="isRecurr" className="font-black text-teal-800 dark:text-teal-400 cursor-pointer">
                   Энэ бол тогтмол давтамжтай ажил (7 хоногийн тодорхой өдрүүдэд)
                </label>
              </div>
              
              {formData.isRecurring && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Ажиллах гарагуудаа сонгоно уу</label>
                  <div className="flex flex-wrap gap-2">
                    {WEEKDAYS.map(day => {
                      const isSelected = formData.recurringDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleRecurringDay(day)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                            isSelected 
                              ? 'bg-teal-600 text-white border-teal-600 shadow-md' 
                              : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-teal-400'
                          }`}
                        >
                          {isSelected ? '✓ ' : ''}{day}
                        </button>
                      )
                    })}
                  </div>
                  {formData.recurringDays.length === 0 && <p className="text-xs text-red-500 mt-2 font-bold">Ядаж 1 гараг сонгоно уу!</p>}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button type="submit" disabled={loading || isSalaryTooLow} className="w-full sm:w-auto px-8 py-3.5 font-bold rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-700 transition-colors">
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