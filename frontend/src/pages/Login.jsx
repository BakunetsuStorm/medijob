import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  
  // Ой санамжаас login функцийг дуудаж авах
  const { login } = useContext(AuthContext); 

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(""); // Бичиж эхлэхэд алдааны мессежийг арилгах
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend рүү нэвтрэх мэдээллийг шидэх
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      // Амжилттай болбол AuthContext руу датаг хадгалах
      login(response.data); 
      
      alert(`Тавтай морил, ${response.data.name}!`);
      navigate("/"); // Нүүр хуудас руу шиднэ
    } catch (error) {
      console.error("Нэвтрэхэд алдаа:", error);
      // Backend-ээс ирсэн алдааг дэлгэцэнд харуулах
      setErrorMsg(error.response?.data?.message || "И-мэйл эсвэл нууц үг буруу байна.");
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      
      {/* 1. Left Side (Зөвхөн том дэлгэц дээр харагдана) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="relative z-10 px-16 text-white max-w-xl">
          <Link to="/" className="inline-flex items-center gap-3 text-3xl font-black tracking-tight mb-12 hover:opacity-80 transition-opacity">
            <span className='bg-white text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center shadow-xl'>M</span>
            MediJob
          </Link>
          <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">
            Тавтай морил.
          </h1>
          <p className="text-blue-100 text-lg font-medium leading-relaxed">
            Мянга мянган боломжууд таныг хүлээж байна. Нэвтэрч ороод карьераа үргэлжлүүлээрэй.
          </p>
        </div>
      </div>

      {/* 2. Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12 relative overflow-y-auto">
        <Link to="/" className="absolute top-8 left-6 lg:hidden text-gray-400 hover:text-gray-900 font-medium">
          ← Буцах
        </Link>
        <div className="w-full max-w-md my-auto">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Нэвтрэх</h2>
            <p className="text-gray-500 font-medium">
              Бүртгэлгүй бол{" "}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                энд дарж бүртгүүлнэ үү
              </Link>
            </p>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Алдаа гарвал харагдах хэсэг */}
              {errorMsg && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl font-bold flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">И-мэйл хаяг</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Нууц үг</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Нууц үгээ оруулна уу"
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all hover:-translate-y-0.5 mt-2"
              >
                Нэвтрэх
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;