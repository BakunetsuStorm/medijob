import React, { createContext, useState, useEffect } from 'react';

// 1. Context буюу Ой санамжийн савыг үүсгэх
export const AuthContext = createContext();

// 2. Бүх хуудсуудад энэ санамжийг түгээх "Provider"
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Вэб рүү орох болгонд өмнө нь нэвтэрсэн байвал мэдээллийг нь татаж авах
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Нэвтрэх үйлдэл (Локал сторэйж рүү хадгална)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
  };

  // Гарах үйлдэл (Бүх мэдээллийг устгана)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};