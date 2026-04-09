import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker", // worker эсвэл employer
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Бүртгүүлэх мэдээлэл:", formData);
    alert("Бүртгүүлэх API холбогдоогүй байна!");
  };

  return (
    <div className="min-h-screen flex w-full">
      
      {/* 1. Left Side - Rich Visual Branding (Hidden on mobile) */}
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
            Карьераа өсгөх эсвэл <br/><span className="text-blue-300">багаа бүрдүүлэх.</span>
          </h1>
          <p className="text-blue-100 text-lg font-medium leading-relaxed">
            Шилдэг мэргэжилтнүүд болон шинийг эрэлхийлэгч компаниудын нэгдэлд тавтай морил.
          </p>
        </div>
      </div>

      {/* 2. Right Side - The Boxed Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12 relative overflow-y-auto">
        
        {/* Back to home button for mobile only */}
        <Link to="/" className="absolute top-8 left-6 lg:hidden text-gray-400 hover:text-gray-900 font-medium">
          ← Буцах
        </Link>

        <div className="w-full max-w-md my-auto">
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Шинээр бүртгүүлэх </h2>
            <p className="text-gray-500 font-medium">
              Бүртгэлтэй бол{" "}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                энд дарж нэвтэрнэ үү
              </Link>
            </p>
          </div>

          {/* The Clearly Boxed Credentials Area */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Custom Role Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Та хэн бэ?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "worker" })}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                      formData.role === "worker" 
                      ? "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-sm" 
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                     Ажил хайгч
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "employer" })}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all border ${
                      formData.role === "employer" 
                      ? "bg-blue-50 border-blue-600 text-blue-700 ring-1 ring-blue-600 shadow-sm" 
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                     Ажил олгогч
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Овог, Нэр / Байгууллага</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Жнь: Батдорж"
                  required
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                />
              </div>

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
                  placeholder="Хамгийн багадаа 8 тэмдэгт"
                  required
                  onChange={handleChange}
                  className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all sm:text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center mt-2 py-4 px-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/40 focus:outline-none transition-all hover:-translate-y-0.5"
              >
                Бүртгэл үүсгэх
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4 font-medium">
                Бүртгүүлснээр та манай <a href="#" className="underline hover:text-gray-600">Үйлчилгээний нөхцөл</a>-ийг зөвшөөрсөнд тооцно.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;