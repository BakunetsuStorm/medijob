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
    // Одоогоор зөвхөн шалгах зорилготой, дараа нь Backend-тэй холбоно
    console.log("Нэвтрэх мэдээлэл:", formData);
    alert("Нэвтрэх API холбогдоогүй байна!");
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Системд нэвтрэх
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Эсвэл{" "}
          <Link
            to='/register'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            шинээр бүртгүүлэх
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-2xl sm:px-10'>
          <form className='space-y-6' onSubmit={handleSubmit}>
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

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900'
                >
                  Намайг санах
                </label>
              </div>

              <div className='text-sm'>
                <a
                  href='#'
                  className='font-medium text-blue-600 hover:text-blue-500'
                >
                  Нууц үгээ мартсан уу?
                </a>
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                Нэвтрэх
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
