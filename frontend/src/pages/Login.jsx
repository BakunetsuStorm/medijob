import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Нэвтрэх мэдээлэл:", formData);
    alert("Нэвтрэх API холбогдоогүй байна!");
  };

  return (
    <div className="min-h-screen flex w-full">
      
      {/* 1. Left Side - Rich Visual Branding (Hidden on mobile, shows on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-600 overflow-hidden items-center justify-center">
        
        {/* Background Gradients & Subtle Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        
        {/* Decorative glowing orbs */}
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-indigo-400 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>

        <div className="relative z-10 px-16 text-white max-w-xl">
          <Link to="/" className="inline-flex items-center gap-3 text-3xl font-black tracking-tight mb-12 hover:opacity-80 transition-opacity">
            <span className='bg-white text-blue-600 rounded-xl w-12 h-12 flex items-center justify-center shadow-xl'>M</span>
            MediJob
          </Link>
          <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">
            Таны шинэ <br/>ажлын гараа <span className="text-blue-300">эндээс</span> эхэлнэ.
          </h1>
          <p className="text-blue-100 text-lg font-medium leading-relaxed">
            Монголын хамгийн том freelance платформд нэгдэж, ур чадвараа бодит орлого болгоорой.
          </p>
        </div>
      </div>

      {/* 2. Right Side - The Boxed Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12 relative">
        
        {/* Back to home button for mobile only */}
        <Link to="/" className="absolute top-8 left-6 lg:hidden text-gray-400 hover:text-gray-900">
          ← Буцах
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Тавтай морил </h2>
            <p className="text-gray-500 font-medium">
              Бүртгэлгүй юу?{" "}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Шинээр бүртгүүлэх
              </Link>
            </p>
          </div>

          {/* The Clearly Boxed Credentials Area */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">И-мэйл хаяг</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Нууц үг</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-gray-600 cursor-pointer">
                    Намайг санах
                  </label>
                </div>

                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                  Нууц үгээ мартсан?
                </a>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/40 focus:outline-none transition-all hover:-translate-y-0.5"
              >
                Системд нэвтрэх
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;