import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios-ийг оруулж ирэх
import WorkFlow from '../components/WorkFlow';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

const Home = () => {
  // Өгөгдлийн сангаас ирэх заруудыг хадгалах State
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Хуудас анх ачааллахад ажиллах функц
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Backend API руу хүсэлт илгээх
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data); // Ирсэн датаг state-д хадгалах
        setLoading(false);
      } catch (error) {
        console.error('Ажлын зар татахад алдаа гарлаа:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 1. Navbar хэсэг */}
      <div className="flex gap-4">
          <Link to="/add-job" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
            Зар оруулах
          </Link>
          <button className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-200 transition">
            Нэвтрэх
          </button>
        </div>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">M</span>
          MediJob
        </div>
        <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <a href="#" className="hover:text-blue-600">Нүүр</a>
          <a href="#" className="hover:text-blue-600">Ажил хайх</a>
          <a href="#" className="hover:text-blue-600">Блог</a>
          <a href="#" className="hover:text-blue-600">Бидэнтэй холбогдох</a>
        </div>
        <button className="bg-blue-100 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-200 transition">
          Нэвтрэх
        </button>
      </nav>

      {/* 2. Hero / Хайлтын хэсэг */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h4 className="text-blue-500 font-bold tracking-widest text-sm uppercase mb-4">
          Ажлын урсгал
        </h4>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Хэрхэн ажилладаг вэ?
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg">
          Бид таныг ур чадварт тань тохирсон цагийн ажил болон богино хугацааны төслүүдтэй шуурхай холбож, найдвартай орлоготой болоход тань тусална.
        </p>
      </section>

      {/* 3. Ажлын урсгал хэсэг (WorkFlow) */}
      <WorkFlow />

      {/* 4. Санал болгож буй ажлууд */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Санал болгож буй ажлууд</h2>
          <a href="#" className="text-gray-900 font-semibold hover:text-blue-600 flex items-center gap-1">
            Бүгдийг үзэх <span>→</span>
          </a>
        </div>

        {/* Дата уншиж байх үеийн төлөв */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Түр хүлээнэ үү, мэдээллийг татаж байна...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">Одоогоор шинэ ажлын зар алга байна.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Backend-ээс ирсэн датаг map хийж харуулах */}
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;