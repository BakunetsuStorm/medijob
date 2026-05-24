import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker", 
    professions: [], 
    companyRegNumber: "", 
    companyIndustry: "",  
    birthYear: "" // ШИНЭ: Төрсөн он
  });

  const availableProfessions = [
  'Зөөгч, Бариста', 'Касс, Худалдагч', 'Угтах үйлчилгээ (Ресепшн)', 
  'Бараа өрөгч, Агуулах', 'Тогооч, Тогоочийн туслах', 'Цэвэрлэгээ, Үйлчилгээ',
  'Түгээлт, Хүргэлт', 'Ачигч, Хар ажил', 'Жолооч',
  'Мэдээлэл оруулагч (Data Entry)', 'Хэрэглэгчийн төв (Call Center)', 'Орчуулга',
  'Промоутер, Борлуулалт', 'Сошиал медиа хөгжүүлэлт', 'Маркетинг, Олон нийттэй харилцах',
  'Вэб болон Апп хөгжүүлэлт', 'График дизайн', 'Видео эвлүүлэг, Зураг авалт', 'Мэдээллийн технологи (IT)',
  'Гэрийн багш, Сургалт', 'Эвэнт, Арга хэмжээний туслах', 'Бусад'
  ];

  const industries = [
    'Мэдээллийн технологи, Харилцаа холбоо',
    'Худалдаа, Үйлчилгээ',
    'Барилга, Үл хөдлөх хөрөнгө',
    'Боловсрол, Сургалт',
    'Эрүүл мэнд, Эмнэлэг',
    'Уул уурхай, Хүнд үйлдвэр',
    'Банк, Санхүү',
    'Бусад'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleProfession = (prof) => {
    setFormData((prev) => {
      const isSelected = prev.professions.includes(prof);
      if (isSelected) {
        return { ...prev, professions: prev.professions.filter((p) => p !== prof) };
      } else {
        return { ...prev, professions: [...prev.professions, prof] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentYear = new Date().getFullYear();
      let calculatedAge = null;
      
      // Ажил хайгч бол насыг нь бодох логик
      if (formData.role === "worker") {
        if (!formData.birthYear || formData.birthYear < 1950 || formData.birthYear > currentYear - 14) {
          toast.error("Төрсөн оноо зөв оруулна уу (14-өөс дээш настай байх шаардлагатай).");
          return;
        }
        calculatedAge = currentYear - Number(formData.birthYear);
      }

      // Backend рүү шидэх дата
      const submitData = {
        ...formData,
        age: calculatedAge
      };

      await axios.post("http://localhost:5000/api/auth/register", submitData);
      
      toast.success("Амжилттай бүртгүүллээ! Одоо нэвтэрч орно уу.");
      navigate("/login"); 
    } catch (error) {
      console.error("Бүртгэхэд алдаа гарлаа:", error);
      toast.error(error.response?.data?.message || "Бүртгүүлэхэд алдаа гарлаа");
    }
  };

  return (
    <div className="min-h-screen flex w-full transition-colors duration-300 dark:bg-[#0a0a0a]">
      
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>

        <div className="relative z-10 px-16 text-white max-w-xl">
          <Link to="/" className="inline-flex items-center gap-3 text-3xl font-black tracking-tight mb-12 hover:opacity-80 transition-opacity">
            <span className='bg-white text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center shadow-xl'>M</span>
            MediJob
          </Link>
          <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">
            Карьераа өсгөх эсвэл <br/><span className="text-blue-300">багаа бүрдүүлэх.</span>
          </h1>
          <p className="text-blue-100 text-lg font-medium leading-relaxed">
            Шилдэг мэргэжилтнүүд болон шинийг эрэлхийлэгч компаниудын нэгдэлд тавтай морил.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-6 py-12 relative overflow-y-auto transition-colors duration-300">
        <Link to="/" className="absolute top-8 left-6 lg:hidden text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">
          ← Буцах
        </Link>

        <div className="w-full max-w-md my-auto">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2 transition-colors">Шинээр бүртгүүлэх</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">
              Бүртгэлтэй бол <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">энд дарж нэвтэрнэ үү</Link>
            </p>
          </div>

          <div className="bg-white dark:bg-[#111111] p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-3 transition-colors">Та хэн бэ?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "worker", companyRegNumber: "", companyIndustry: "" })}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                      formData.role === "worker" 
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400 ring-1 ring-blue-600 shadow-sm" 
                        : "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-[#222222] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >Ажил хайгч</button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "employer", professions: [], birthYear: "" })}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                      formData.role === "employer" 
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-400 ring-1 ring-blue-600 shadow-sm" 
                        : "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-[#222222] hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >Ажил олгогч</button>
                </div>
              </div>

              {formData.role === "worker" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 transition-colors">Төрсөн он</label>
                    <input type="number" name="birthYear" value={formData.birthYear} placeholder="Жнь: 2004" required onChange={handleChange} className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium focus:bg-white dark:focus:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 transition-colors">Мэргэжил / Чиглэлээ сонгоно уу</label>
                    <div className="flex flex-wrap gap-2">
                      {availableProfessions.map((prof, idx) => {
                        const isSelected = formData.professions.includes(prof);
                        return (
                          <button 
                            key={idx} 
                            type="button" 
                            onClick={() => toggleProfession(prof)} 
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              isSelected 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            {isSelected ? '✓ ' : ''}{prof}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {formData.role === "employer" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 transition-colors">Байгууллагын Регистр <span className="text-gray-400 dark:text-gray-500 font-medium text-xs">(Хувь хүн бол хоосон орхино)</span></label>
                    <input type="text" name="companyRegNumber" value={formData.companyRegNumber} placeholder="Жнь: 1234567" onChange={handleChange} className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium focus:bg-white dark:focus:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 transition-colors">Үйл ажиллагааны чиглэл <span className="text-gray-400 dark:text-gray-500 font-medium text-xs">(Нэмэлт)</span></label>
                    <select name="companyIndustry" value={formData.companyIndustry} onChange={handleChange} className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium focus:bg-white dark:focus:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm cursor-pointer">
                      <option value="">-- Сонгохгүй байж болно --</option>
                      {industries.map((ind, idx) => (
                        <option key={idx} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 transition-colors">{formData.role === 'employer' ? 'Овог нэр эсвэл Байгууллагын нэр' : 'Овог, Нэр'}</label>
                <input type="text" name="name" placeholder={formData.role === 'employer' ? "Жнь: Тест ХХК эсвэл Батдорж" : "Жнь: Батдорж"} required onChange={handleChange} className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 transition-colors">И-мэйл хаяг</label>
                <input type="email" name="email" placeholder="name@example.com" required onChange={handleChange} className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-gray-300 mb-2 transition-colors">Нууц үг</label>
                <input type="password" name="password" placeholder="Хамгийн багадаа 8 тэмдэгт" required onChange={handleChange} className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm" />
              </div>

              <button type="submit" disabled={formData.role === 'worker' && (!formData.birthYear || formData.professions.length === 0)} className="w-full flex justify-center mt-2 py-4 px-4 rounded-xl shadow-lg shadow-blue-600/20 dark:shadow-none text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:dark:bg-gray-600 disabled:shadow-none focus:outline-none transition-all hover:-translate-y-0.5">
                Бүртгэл үүсгэх
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;