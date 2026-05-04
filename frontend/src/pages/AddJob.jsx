import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// 📍 Дүүрэг болон Хорооны тоог хадгалах дата
const LOCATION_DATA = {
  "Улаанбаатар": {
    "Багануур дүүрэг": 5,
    "Багахангай дүүрэг": 2,
    "Баянгол дүүрэг (БГД)": 34,
    "Баянзүрх дүүрэг (БЗД)": 43,
    "Налайх дүүрэг": 8,
    "Сонгинохайрхан дүүрэг (СХД)": 43,
    "Хан-Уул дүүрэг (ХУД)": 25,
    "Чингэлтэй дүүрэг (ЧД)": 24
  }
};

const AddJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', category: '', employerName: '', salary: '', 
    salaryType: 'цаг', locationType: 'Зайнаас', requirements: '',
    // Шинэ байршлын талбарууд
    city: 'Улаанбаатар',
    district: '',
    khoroo: '',
    specificAddress: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Дүүрэг солигдох үед хороог дахин хоослох
  const handleDistrictChange = (e) => {
    setFormData({ ...formData, district: e.target.value, khoroo: '' });
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

    // 📍 Байршлуудыг нийлүүлж нэг String болгох
    let finalLocation = '';
    if (formData.locationType !== 'Зайнаас') {
      if (!formData.district || !formData.khoroo || !formData.specificAddress) {
        alert("Байршлын мэдээллийг гүйцэд оруулна уу (Дүүрэг, Хороо, Дэлгэрэнгүй хаяг).");
        return;
      }
      finalLocation = `${formData.city}, ${formData.district}, ${formData.khoroo}-р хороо, ${formData.specificAddress}`;
    }

    // Backend рүү илгээх эцсийн дата
    const submitData = {
      title: formData.title,
      category: formData.category,
      employerName: formData.employerName,
      salary: formData.salary,
      salaryType: formData.salaryType,
      locationType: formData.locationType,
      location: finalLocation, // Нийлүүлсэн хаягаа илгээнэ
      requirements: formData.requirements
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

  // Тухайн сонгосон дүүрэгт хэдэн хороо байгааг гаргаж авах
  const khorooCount = formData.district ? LOCATION_DATA["Улаанбаатар"][formData.district] : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><Link to="/" className="text-gray-500 hover:text-gray-900 font-bold text-sm flex items-center gap-2 w-fit">← Буцах</Link></div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-8 py-10 sm:px-12">
            <h2 className="text-3xl font-black text-white mb-2">Шинэ зар оруулах</h2>
            <p className="text-gray-400 font-medium text-sm">Мянга мянган ур чадвартай мэргэжилтнүүдэд нээлттэй болгох.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 sm:p-12 space-y-10">
            
            {/* 1. Ерөнхий мэдээлэл */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">Ерөнхий мэдээлэл</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ажлын гарчиг</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Жнь: Ахлах вэб хөгжүүлэгч" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ажлын ангилал</label>
                    <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                      <option value="" disabled>-- Ангилал сонгох --</option>
                      <option value="Вэб хөгжүүлэлт">Вэб хөгжүүлэлт</option>
                      <option value="График дизайн">График дизайн</option>
                      <option value="Орчуулга">Орчуулга</option>
                      <option value="Маркетинг">Маркетинг</option>
                      <option value="Бусад">Бусад</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ажил олгогчийн нэр</label>
                    <input type="text" name="employerName" required value={formData.employerName} onChange={handleChange} placeholder="Жнь: Tech ХХК" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Ажлын нөхцөл & Байршил */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">Ажлын нөхцөл & Байршил</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Ажиллах хэлбэр</label>
                  <div className="grid grid-cols-3 gap-3 md:w-1/2">
                    {['Зайнаас', 'Оффис', 'Холимог'].map((type) => (
                      <button key={type} type="button" onClick={() => setFormData({ ...formData, locationType: type })} className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${formData.locationType === type ? "bg-blue-50 border-blue-600 text-blue-700" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>{type}</button>
                    ))}
                  </div>
                </div>

                {/* 🔥 БАЙРШЛЫН DROPDOWN ХЭСЭГ (Зөвхөн Зайнаас биш үед харагдана) */}
                {formData.locationType !== 'Зайнаас' && (
                  <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-5 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-bold text-indigo-900 border-b border-indigo-200/50 pb-2"> Хаягийн мэдээлэл</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Хот / Аймаг</label>
                        <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-gray-700">
                          <option value="Улаанбаатар">Улаанбаатар</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Дүүрэг</label>
                        <select name="district" value={formData.district} onChange={handleDistrictChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                          <option value="" disabled>-- Дүүрэг сонгох --</option>
                          {Object.keys(LOCATION_DATA["Улаанбаатар"]).map(dist => (
                            <option key={dist} value={dist}>{dist}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Хороо</label>
                        <select name="khoroo" value={formData.khoroo} onChange={handleChange} disabled={!formData.district} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed">
                          <option value="" disabled>-- Хороо --</option>
                          {Array.from({ length: khorooCount }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}-р хороо</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Гудамж, Барилга, Тоот</label>
                      <input type="text" name="specificAddress" value={formData.specificAddress} onChange={handleChange} placeholder="Жнь: Тэнгис кино театрын ард, MN Tower 5 давхарт..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ажлын дэлгэрэнгүй & Шаардлага</label>
                  <textarea name="requirements" required value={formData.requirements} onChange={handleChange} rows="5" placeholder="Хийгдэх ажлууд болон тавигдах шаардлагуудыг дэлгэрэнгүй бичнэ үү..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-y"></textarea>
                </div>
              </div>
            </div>

            {/* 3. Цалин */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-5 border-b border-gray-100 pb-2">Цалингийн мэдээлэл</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Цалингийн хэмжээ (₮)</label>
                  <input type="number" name="salary" required value={formData.salary} onChange={handleChange} placeholder={`Доод тал нь ${minRequired.toLocaleString()}₮`} className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 outline-none transition-all ${isSalaryTooLow ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-600'}`} />
                  {isSalaryTooLow && <p className="mt-2 text-xs text-red-500 font-bold">Хуулийн дагуу цалингийн доод хэмжээнд хүрээгүй байна.</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Цалин бодох төрөл</label>
                  <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                    <option value="цаг">Цагаар</option>
                    <option value="өдөр">Өдрөөр</option>
                    <option value="төсөл">Төслөөр</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={loading || isSalaryTooLow} className="w-full sm:w-auto px-8 py-3.5 font-bold rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 disabled:bg-gray-400">
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