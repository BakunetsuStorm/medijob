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
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Шинээр бүртгүүлэх
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Бүртгэлтэй бол{" "}
          <Link
            to='/login'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            энд дарж нэвтэрнэ үү
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-2xl sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            {/* Төрөл сонгох */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Би хэн бэ?
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, role: "worker" })}
                  className={`py-2 px-4 border rounded-xl text-sm font-semibold transition-colors ${formData.role === "worker" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Ажил хайгч
                </button>
                <button
                  type='button'
                  onClick={() => setFormData({ ...formData, role: "employer" })}
                  className={`py-2 px-4 border rounded-xl text-sm font-semibold transition-colors ${formData.role === "employer" ? "bg-blue-50 border-blue-500 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  Ажил олгогч
                </button>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Овог, Нэр
              </label>
              <div className='mt-1'>
                <input
                  type='text'
                  name='name'
                  required
                  onChange={handleChange}
                  className='appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                И-мэйл хаяг
              </label>
              <div className='mt-1'>
                <input
                  type='email'
                  name='email'
                  required
                  onChange={handleChange}
                  className='appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Нууц үг
              </label>
              <div className='mt-1'>
                <input
                  type='password'
                  name='password'
                  required
                  onChange={handleChange}
                  className='appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                Бүртгүүлэх
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
