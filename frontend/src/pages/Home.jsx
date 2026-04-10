import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import WorkFlow from "../components/WorkFlow";
import JobCard from "../components/JobCard";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user, logout } = useContext(AuthContext); 

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Бүгд");

  const categories = ['Бүгд', 'Вэб хөгжүүлэлт', 'График дизайн', 'Орчуулга', 'Маркетинг', 'Бусад'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Ажлын зар татахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.employerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Бүгд" || job.category.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className='min-h-screen bg-white font-sans text-gray-900'>
      
      {/* 1. Navbar */}
      <nav className='w-full px-6 md:px-12 lg:px-24 py-4 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100'>
        <Link to="/" className='text-2xl font-black tracking-tighter flex items-center gap-2'>
          <div className='bg-black text-white rounded-lg w-8 h-8 flex items-center justify-center text-lg'>M</div>
          Medi<span className="text-blue-600">Job.</span>
        </Link>

        <div className='hidden md:flex space-x-8 font-semibold text-sm text-gray-600'>
          <a href='#' className='text-black'>Ажил хайх</a>
          <a href='#' className='hover:text-black transition-colors'>Мэргэжилтнүүд</a>
          <a href='#' className='hover:text-black transition-colors'>Блог</a>
        </div>

        {/* НЭВТРЭСЭН ЭСЭХИЙГ ШАЛГАХ ХЭСЭГ */}
        <div className='flex items-center gap-4 text-sm font-bold'>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full hidden sm:inline-block">
                Сайн уу, <span className="text-black font-black">{user.name}</span>.
              </span>
              
              {/* ЗӨВХӨН АЖИЛ ОЛГОГЧ: "Миний зарууд" болон "Зар оруулах" товчийг харна */}
              {user.role === 'employer' && (
                <>
                  <Link to='/my-jobs' className='text-gray-600 hover:text-black font-bold transition-colors'>
                    Миний зарууд
                  </Link>
                  <Link to='/add-job' className='bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all'>
                    Зар оруулах
                  </Link>
                </>
              )}

              <button 
                onClick={logout} 
                className="text-red-500 hover:text-red-600 transition-colors font-bold"
              >
                Гарах
              </button>
            </div>
          ) : (
            <>
              <Link to='/login' className='text-gray-600 hover:text-black transition-colors'>
                Нэвтрэх
              </Link>
              <Link to='/register' className='bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all'>
                Бүртгүүлэх
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className='relative w-full px-6 md:px-12 lg:px-24 pt-24 pb-32 flex flex-col items-center justify-center border-b border-gray-100'>
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Монголын #1 Freelance Платформ
          </div>
          <h1 className='text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]'>
            Ур чадвараа <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              Жинхэнэ Үнэ Цэнэ
            </span> болго
          </h1>
          <p className='text-gray-500 text-lg md:text-xl mb-12 max-w-2xl font-medium'>
            Дизайн, хөгжүүлэлт, орчуулга зэрэг 100+ ангилалд мянга мянган боломжууд таныг хүлээж байна.
          </p>

          <div className="w-full max-w-2xl bg-white p-2 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-2 transition-shadow focus-within:shadow-[0_8px_30px_rgb(37,99,235,0.12)] focus-within:border-blue-200">
            <div className="pl-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
            </div>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ямар ажил хайж байна вэ?" className="w-full py-4 px-2 text-gray-800 font-medium bg-transparent border-none outline-none placeholder-gray-400"/>
            <button onClick={() => document.getElementById('jobs-section').scrollIntoView({ behavior: 'smooth' })} className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">Хайх</button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <span className="text-sm font-bold text-gray-400 mr-2">Түгээмэл:</span>
            {categories.map((tag, idx) => (
              <button key={idx} onClick={() => setSelectedCategory(tag)} className={`px-4 py-1.5 rounded-full border text-sm font-semibold cursor-pointer transition-all ${selectedCategory === tag ? 'bg-black border-black text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-black hover:text-black'}`}>{tag}</button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stats */}
      <section className="w-full bg-black text-white py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-800">
          <div className="pt-6 md:pt-0"><h3 className="text-4xl font-black mb-1">12,000+</h3><p className="text-gray-400 font-medium">Амжилттай төслүүд</p></div>
          <div className="pt-6 md:pt-0"><h3 className="text-4xl font-black mb-1 text-blue-500">5,400+</h3><p className="text-gray-400 font-medium">Мэргэжилтнүүд</p></div>
          <div className="pt-6 md:pt-0"><h3 className="text-4xl font-black mb-1">98%</h3><p className="text-gray-400 font-medium">Сэтгэл ханамж</p></div>
        </div>
      </section>

      <div className="bg-gray-50/50 pt-10"><WorkFlow /></div>

      {/* 4. Jobs */}
      <section id="jobs-section" className='w-full px-6 md:px-12 lg:px-24 py-24 bg-gray-50'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4'>
          <div>
            <div className="flex items-center gap-2 mb-2"><span className="w-8 h-1 bg-blue-600 rounded-full"></span><h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">{selectedCategory === "Бүгд" ? "Шинээр нэмэгдсэн" : `${selectedCategory} чиглэлээр`}</h2></div>
            <h3 className='text-3xl md:text-4xl font-black text-gray-900'>{searchQuery ? `"${searchQuery}" хайлтын үр дүн` : "Хамгийн сүүлийн үеийн ажлууд"}</h3>
          </div>
          <p className='text-gray-500 font-bold'>Нийт <span className="text-blue-600">{filteredJobs.length}</span> ажил олдлоо</p>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-32'><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-blue-600"></div></div>
        ) : filteredJobs.length === 0 ? (
          <div className='text-center bg-white rounded-3xl py-32 border border-gray-100 shadow-sm'>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Илэрц олдсонгүй</h4>
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("Бүгд"); }} className="mt-6 text-blue-600 font-bold hover:underline">Шүүлтүүр цэвэрлэх</button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredJobs.map((job) => (<JobCard key={job._id} job={job} />))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;