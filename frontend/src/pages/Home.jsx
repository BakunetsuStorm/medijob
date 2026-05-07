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

  // 🔥 ШИНЭ: Dark Mode төлөв (Local Storage-аас шалгах)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // 🔥 ШИНЭ: Dark Mode солих үйлдэл
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Бүгд");
  const [filterWorkType, setFilterWorkType] = useState("Бүгд"); 
  const [filterLocation, setFilterLocation] = useState("");     
  const [minSalary, setMinSalary] = useState("");               
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false); 
  const [matchMySkills, setMatchMySkills] = useState(false);
  const [minRating, setMinRating] = useState(0); 

  const categories = ['Бүгд', 'Вэб хөгжүүлэлт', 'График дизайн', 'Орчуулга', 'Маркетинг', 'Мэдээллийн технологи (IT)', 'Бусад'];

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
    const matchText = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      job.employerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === "Бүгд" || job.category?.includes(selectedCategory);
    const matchWorkType = filterWorkType === "Бүгд" || job.locationType === filterWorkType;
    const matchLocation = filterLocation === "" || (job.location && job.location.toLowerCase().includes(filterLocation.toLowerCase()));
    const matchSalary = minSalary === "" || Number(job.salary) >= Number(minSalary);

    const jobRating = job.rating || 0;
    const matchRatingValue = jobRating >= minRating; 

    let isSkillMatch = true;
    if (matchMySkills && user && user.role === 'worker') {
      if (user.professions && user.professions.length > 0) {
        isSkillMatch = user.professions.includes(job.category);
      } else {
        isSkillMatch = false; 
      }
    }

    return matchText && matchCategory && matchWorkType && matchLocation && matchSalary && isSkillMatch && matchRatingValue;
  }).sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    if (ratingB !== ratingA) return ratingB - ratingA; 
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const isSearching = searchQuery || filterLocation || minSalary || selectedCategory !== "Бүгд" || matchMySkills || minRating > 0;

  return (
    // 🔥 Бусад хэсгийн өнгөнүүдийг dark: хувилбараар нэмсэн
    <div className='min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300'>
      
      {/* 1. Navbar */}
      <nav className='w-full px-6 md:px-12 lg:px-24 py-4 flex justify-between items-center bg-white dark:bg-[#111111] sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300'>
        <Link to="/" className='text-2xl font-black tracking-tighter flex items-center gap-2 text-gray-900 dark:text-white'>
          <div className='bg-black dark:bg-white text-white dark:text-black rounded-lg w-8 h-8 flex items-center justify-center text-lg transition-colors duration-300'>M</div>
          Medi<span className="text-blue-600">Job.</span>
        </Link>

        <div className='hidden md:flex space-x-8 font-semibold text-sm text-gray-600 dark:text-gray-300'>
          <button onClick={() => document.getElementById('jobs-section').scrollIntoView({ behavior: 'smooth' })} className='hover:text-black dark:hover:text-white transition-colors'>Ажил хайх</button>
          <button onClick={() => document.getElementById('workflow-section').scrollIntoView({ behavior: 'smooth' })} className='hover:text-black dark:hover:text-white transition-colors'>Хэрхэн ажилладаг вэ?</button>
        </div>

        <div className='flex items-center gap-4 text-sm font-bold'>
          
          {/* 🔥 ШИНЭ: Dark Mode Toggle Товч */}
          <button 
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-lg"
            title="Өнгө солих"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors px-4 py-2 rounded-full hidden sm:inline-block">
                Сайн уу, <span className="text-black dark:text-white font-black">{user.name}</span> 
              </Link>
              {user.role === 'worker' && (<Link to='/my-applications' className='text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 font-bold px-5 py-2.5 rounded-xl transition-all'>Миний хүсэлтүүд</Link>)}
              {user.role === 'admin' && (<Link to='/admin' className='bg-red-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-600 transition-all'>Админ Самбар</Link>)}
              {user.role === 'employer' && (
                <>
                  <Link to='/my-jobs' className='text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-bold'>Миний зарууд</Link>
                  <Link to='/add-job' className='bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all'>Зар оруулах</Link>
                  <Link to="/my-workers" className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-xl text-sm">Миний ажилтнууд</Link>
                </>
              )}
              <button onClick={logout} className="text-red-500 hover:text-red-600 font-bold">Гарах</button>
            </div>
          ) : (
            <>
              <Link to='/login' className='text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white'>Нэвтрэх</Link>
              <Link to='/register' className='bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700'>Бүртгүүлэх</Link>
            </>
          )}
        </div>
      </nav>

      {/* 2. ЗӨВХӨН ХАЙЛТ */}
      <section className="w-full bg-white dark:bg-[#111111] pt-8 pb-8 px-6 flex justify-center border-b border-gray-100 dark:border-gray-800 shadow-sm relative z-40 transition-colors duration-300">
        <div className="w-full max-w-5xl relative">
          <div className="flex flex-col md:flex-row items-center gap-2 w-full bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl md:rounded-full border border-gray-200 dark:border-gray-700 p-2 focus-within:ring-2 ring-blue-500/20 transition-all shadow-inner">
            <div className="hidden md:block pl-4 text-gray-400 dark:text-gray-500">🔍</div>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Ажлын гарчиг эсвэл компани хайх..." 
              className="w-full py-3 px-3 text-sm md:text-base text-gray-800 dark:text-gray-100 font-bold bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500"
            />
            
            <button 
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)} 
              className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-4 whitespace-nowrap md:border-r border-gray-300 dark:border-gray-700 w-full md:w-auto text-left md:text-center py-2 md:py-0 transition-colors"
            >
              {showAdvancedSearch ? 'Шүүлтүүр хаах' : 'Нарийвчлах'}
            </button>

            <button 
              onClick={() => document.getElementById('jobs-section').scrollIntoView({ behavior: 'smooth' })} 
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl md:rounded-full text-sm font-bold hover:bg-blue-700 transition-colors whitespace-nowrap shadow-md"
            >
              Хайх
            </button>
          </div>

          {showAdvancedSearch && (
            <div className="absolute top-full left-0 right-0 mt-4 p-5 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2 text-left z-50">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Ажиллах хэлбэр</label>
                <select value={filterWorkType} onChange={(e) => setFilterWorkType(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-[#222222] dark:text-white cursor-pointer">
                  <option value="Бүгд">Бүгд</option>
                  <option value="Зайнаас">Зайнаас</option>
                  <option value="Оффис">Оффис</option>
                  <option value="Холимог">Холимог</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Байршил</label>
                <input type="text" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} placeholder="Жнь: СБД" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-[#222222] dark:text-white" disabled={filterWorkType === 'Зайнаас'}/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Доод цалин (₮)</label>
                <input type="number" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} placeholder="Жнь: 50000" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-gray-50 dark:bg-[#222222] dark:text-white"/>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Ажил олгогчийн үнэлгээ</label>
                <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm outline-none focus:border-yellow-500 dark:focus:border-yellow-500 bg-gray-50 dark:bg-[#222222] dark:text-white cursor-pointer">
                  <option value={0}>Бүгд (Үнэлгээ хамаарахгүй)</option>
                  <option value={4}>⭐ 4.0 - өөс дээш</option>
                  <option value={3}>⭐ 3.0 - аас дээш</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Текст болон Ажлын жагсаалт */}
      <section id="jobs-section" className='w-full px-6 md:px-12 lg:px-24 py-12 flex-grow relative z-10'>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
          <div className="max-w-2xl text-left">
            {isSearching ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-1 bg-blue-600 rounded-full"></span>
                  <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    {matchMySkills ? "Таны ур чадварт тохирсон" : selectedCategory !== "Бүгд" ? selectedCategory : "Хайлт"}
                  </h2>
                </div>
                <h1 className='text-3xl md:text-4xl font-black tracking-tight mb-3 text-gray-900 dark:text-white'>
                  Хайлтын үр дүн
                </h1>
                <p className='text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium flex items-center gap-2'>
                  Нийт <span className="text-blue-600 dark:text-blue-400 font-bold">{filteredJobs.length}</span> ажил олдлоо.
                  {minRating > 0 && <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-[10px] px-2 py-0.5 rounded-full font-bold">⭐ {minRating}.0+ үнэлгээтэй</span>}
                </p>
              </>
            ) : (
              <>
                <h1 className='text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-gray-900 dark:text-white leading-tight'>
                  Ур чадвараа <br className="hidden sm:block"/>
                  <span className="text-blue-600 dark:text-blue-400">Жинхэнэ Үнэ Цэнэ</span> болго
                </h1>
                <p className='text-gray-500 dark:text-gray-400 text-sm md:text-base font-medium'>
                  Дизайн, хөгжүүлэлт, орчуулга зэрэг 100+ ангилалд мянга мянган боломжууд таныг хүлээж байна.
                </p>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {user && user.role === 'worker' && (
              <button 
                onClick={() => { setMatchMySkills(!matchMySkills); if(!matchMySkills) setSelectedCategory("Бүгд"); }} 
                className={`px-4 py-2 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  matchMySkills ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 shadow-sm'
                }`}
              >
                 Надад тохирох
              </button>
            )}

            {categories.map((tag, idx) => (
              <button 
                key={idx} 
                onClick={() => { setSelectedCategory(tag); setMatchMySkills(false); }} 
                className={`px-4 py-2 rounded-full border text-xs font-bold transition-all ${
                  selectedCategory === tag && !matchMySkills ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-md' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-black dark:hover:text-white shadow-sm'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-20'><div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 dark:border-gray-800 border-t-blue-600 dark:border-t-blue-400"></div></div>
        ) : filteredJobs.length === 0 ? (
          <div className='text-center bg-white dark:bg-[#111111] rounded-3xl py-20 border border-gray-200 dark:border-gray-800 shadow-sm'>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Илэрц олдсонгүй</h4>
            {matchMySkills && (!user.professions || user.professions.length === 0) ? (
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">Та профайл дээрээ мэргэжлээ оруулаагүй байна.</p>
            ) : null}
            <button onClick={() => { setSearchQuery(""); setSelectedCategory("Бүгд"); setFilterWorkType("Бүгд"); setFilterLocation(""); setMinSalary(""); setMatchMySkills(false); setMinRating(0); }} className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">Шүүлтүүр цэвэрлэх</button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredJobs.map((job) => (<JobCard key={job._id} job={job} />))}
          </div>
        )}
      </section>

      {/* 4. Статистик & WorkFlow */}
      <div className="w-full">
        <section className="w-full bg-black dark:bg-[#050505] text-white py-12 border-t border-gray-900">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-800">
            <div className="pt-6 sm:pt-0"><h3 className="text-3xl font-black mb-1">12,000+</h3><p className="text-gray-400 text-sm font-medium">Амжилттай төслүүд</p></div>
            <div className="pt-6 sm:pt-0"><h3 className="text-3xl font-black mb-1 text-blue-500">5,400+</h3><p className="text-gray-400 text-sm font-medium">Мэргэжилтнүүд</p></div>
            <div className="pt-6 sm:pt-0"><h3 className="text-3xl font-black mb-1">98%</h3><p className="text-gray-400 text-sm font-medium">Сэтгэл ханамж</p></div>
          </div>
        </section>
        <div id="workflow-section" className="bg-white dark:bg-[#111111] py-10 border-t border-gray-100 dark:border-gray-900">
          <WorkFlow />
        </div>
      </div>
    </div>
  );
};

export default Home;