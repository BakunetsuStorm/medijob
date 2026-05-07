import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const LOCATION_DATA = {
  "Улаанбаатар": {
    "Багануур дүүрэг": 5, "Багахангай дүүрэг": 2, "Баянгол дүүрэг (БГД)": 34,
    "Баянзүрх дүүрэг (БЗД)": 43, "Налайх дүүрэг": 8, "Сүхбаатар дүүрэг (СБД)": 20, "Сонгинохайрхан дүүрэг (СХД)": 43,
    "Хан-Уул дүүрэг (ХУД)": 25, "Чингэлтэй дүүрэг (ЧД)": 24
  }
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('jobs'); 
  const [jobs, setJobs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [applications, setApplications] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Админ засах модалын төлөв
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '', title: '', category: '', salary: '', salaryType: '', locationType: '', 
    city: 'Улаанбаатар', district: '', khoroo: '', specificAddress: '', requirements: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const jobsRes = await axios.get("http://localhost:5000/api/jobs");
        setJobs(jobsRes.data);
      } catch (err) { console.error("Зарууд татахад алдаа:", err); }

      try {
        const usersRes = await axios.get("http://localhost:5000/api/auth/users");
        setUsersList(usersRes.data);
      } catch (err) { console.error("Хэрэглэгч татахад алдаа:", err); }

      try {
        const appsRes = await axios.get("http://localhost:5000/api/applications");
        setApplications(appsRes.data);
      } catch (err) { console.error("Өргөдөл татахад алдаа:", err); }

      setLoading(false);
    };
    
    fetchData();
  }, [user, navigate]);

  const handleDeleteJob = async (id) => {
    if (window.confirm("Энэ зарыг шууд устгах уу? (Админы эрхээр)")) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setJobs(jobs.filter(job => job._id !== id));
      } catch (error) {
        alert("Устгахад алдаа гарлаа.");
      }
    }
  };

  const openEditModal = (job) => {
    let parsedCity = 'Улаанбаатар';
    let parsedDistrict = '';
    let parsedKhoroo = '';
    let parsedAddress = '';

    if (job.location && job.location.includes(', ')) {
      const parts = job.location.split(', ');
      if (parts.length >= 4) {
        parsedCity = parts[0];
        parsedDistrict = parts[1];
        parsedKhoroo = parts[2].replace('-р хороо', '');
        parsedAddress = parts.slice(3).join(', ');
      } else {
        parsedAddress = job.location;
      }
    } else {
      parsedAddress = job.location || '';
    }

    setEditFormData({
      _id: job._id, title: job.title, category: job.category, salary: job.salary,
      salaryType: job.salaryType, locationType: job.locationType,
      city: parsedCity, district: parsedDistrict, khoroo: parsedKhoroo, specificAddress: parsedAddress,
      requirements: job.requirements || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    let finalLocation = '';
    if (editFormData.locationType !== 'Зайнаас') {
      if (!editFormData.district || !editFormData.khoroo || !editFormData.specificAddress) {
        alert("Байршлын мэдээллийг гүйцэд оруулна уу.");
        return;
      }
      finalLocation = `${editFormData.city}, ${editFormData.district}, ${editFormData.khoroo}-р хороо, ${editFormData.specificAddress}`;
    }

    const submitData = { ...editFormData, location: finalLocation };

    setUpdating(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/jobs/${editFormData._id}`, submitData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJobs(jobs.map(job => job._id === editFormData._id ? response.data : job));
      alert("Амжилттай засагдлаа! (Админ)");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Засахад алдаа гарлаа.");
    } finally {
      setUpdating(false);
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  const handleEditDistrictChange = (e) => {
    setEditFormData({ ...editFormData, district: e.target.value, khoroo: '' });
  };

  const khorooCount = editFormData.district ? LOCATION_DATA["Улаанбаатар"][editFormData.district] : 0;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] transition-colors"><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 dark:border-gray-800 border-t-red-500"></div></div>;

  const totalUsers = usersList.length;
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const successApps = applications.filter(app => app.status === 'accepted' || app.status === 'completed').length;

  const workerCount = usersList.filter(u => u.role === 'worker').length;
  const employerCount = usersList.filter(u => u.role === 'employer').length;
  const adminCount = usersList.filter(u => u.role === 'admin').length;

  const roleChartData = {
    labels: ['Ажил хайгчид', 'Ажил олгогчид', 'Админ'],
    datasets: [
      {
        data: [workerCount, employerCount, adminCount],
        backgroundColor: ['#3b82f6', '#a855f7', '#ef4444'], 
        hoverBackgroundColor: ['#2563eb', '#9333ea', '#dc2626'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const roleChartOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Inter', weight: 'bold' }, color: '#888' } },
    },
    cutout: '70%', 
  };

  const categoryCounts = {};
  jobs.forEach(job => {
    categoryCounts[job.category] = (categoryCounts[job.category] || 0) + 1;
  });
  
  const categoryLabels = Object.keys(categoryCounts);
  const categoryValues = Object.values(categoryCounts);

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Нийт зар',
        data: categoryValues,
        backgroundColor: 'rgba(249, 115, 22, 0.8)', 
        hoverBackgroundColor: 'rgba(249, 115, 22, 1)',
        borderRadius: 8,
      },
    ],
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0, color: '#888' }, grid: { color: '#333' } },
      x: { grid: { display: false }, ticks: { color: '#888' } }
    }
  };

  return (
    // 🔥 ШИНЭЧЛЭЛТ: dark:bg-[#0a0a0a] нэмэгдсэн
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-6 md:p-10 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3 transition-colors">
              <span className="bg-red-500 text-white p-2.5 rounded-2xl shadow-lg shadow-red-500/30 text-2xl">⚙️</span>
              Системийн Удирдлага
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium transition-colors">MediJob платформын ерөнхий статистик болон хяналт</p>
          </div>
          <Link to="/" className="px-6 py-3 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#222222] hover:text-black dark:hover:text-white transition-colors shadow-sm">
            ← Вэб рүү буцах
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* 🔥 ШИНЭЧЛЭЛТ: Картуудын өнгийг дарк болгосон */}
          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт хэрэглэгч</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white relative z-10">{totalUsers}</h3>
          </div>

          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт ажлын байр</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white relative z-10">{totalJobs}</h3>
          </div>

          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт өргөдөл</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white relative z-10">{totalApps}</h3>
          </div>

          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group border-b-4 border-b-green-500 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Амжилттай өргөдөл</p>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white relative z-10">{successApps}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center transition-colors duration-300">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 w-full text-left">Хэрэглэгчдийн харьцаа</h3>
            <div className="w-full max-w-[250px] relative">
              <Doughnut data={roleChartData} options={roleChartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-5">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{totalUsers}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Нийт</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111111] p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm lg:col-span-2 flex flex-col justify-center transition-colors duration-300">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">Ажлын ангиллын эзлэх хувь</h3>
            <div className="w-full h-64">
              <Bar data={categoryChartData} options={categoryChartOptions} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6 bg-white dark:bg-[#111111] p-2 rounded-2xl w-fit border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'jobs' ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'}`}
          >
            Нийт зарууд
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222222]'}`}
          >
            Нийт хэрэглэгчид
          </button>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
          {activeTab === 'jobs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50/80 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs tracking-wider uppercase transition-colors">
                  <tr>
                    <th className="p-5 font-black">Гарчиг</th>
                    <th className="p-5 font-black">Ажил олгогч</th>
                    <th className="p-5 font-black">Байршил</th>
                    <th className="p-5 font-black">Үүссэн</th>
                    <th className="p-5 font-black text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {jobs.map(job => (
                    <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-5 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {job.title}
                      </td>
                      <td className="p-5 text-gray-600 dark:text-gray-300 font-medium">{job.employerName}</td>
                      <td className="p-5"><span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold px-2.5 py-1 rounded-md text-xs transition-colors">{job.locationType}</span></td>
                      <td className="p-5 text-gray-400 dark:text-gray-500 font-medium">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 text-right">
                        <button onClick={() => openEditModal(job)} className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-4 py-2 rounded-lg font-bold transition-colors mr-2">Засах</button>
                        <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg font-bold transition-colors">Устгах</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50/80 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs tracking-wider uppercase transition-colors">
                  <tr>
                    <th className="p-5 font-black">Нэр</th>
                    <th className="p-5 font-black">И-мэйл</th>
                    <th className="p-5 font-black">Төрөл</th>
                    <th className="p-5 font-black">Бүртгүүлсэн</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {usersList.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors">
                      <td className="p-5 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt="img" className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-black text-gray-500 dark:text-gray-300">{u.name.charAt(0)}</div>
                        )}
                        {u.name}
                      </td>
                      <td className="p-5 text-gray-500 dark:text-gray-400 font-medium">{u.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : u.role === 'employer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-5 text-gray-400 dark:text-gray-500 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* 🔥 ЗАСАХ МОДАЛ ЦОНХ (Админ) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-2xl my-8 border dark:border-gray-800 transition-colors duration-300">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <span className="bg-orange-500 w-2 h-6 rounded-full"></span>
              Ажлын зар засах <span className="text-sm font-medium text-gray-400 dark:text-gray-500">(Админы эрхээр)</span>
            </h3>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Ажлын гарчиг</label>
                <input type="text" name="title" required value={editFormData.title} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Ажлын ангилал</label>
                  <select name="category" required value={editFormData.category} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none cursor-pointer transition-colors">
                    <option value="Вэб хөгжүүлэлт">Вэб хөгжүүлэлт</option>
                    <option value="График дизайн">График дизайн</option>
                    <option value="Орчуулга">Орчуулга</option>
                    <option value="Маркетинг">Маркетинг</option>
                    <option value="Мэдээллийн технологи (IT)">Мэдээллийн технологи (IT)</option>
                    <option value="Бусад">Бусад</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Ажиллах хэлбэр</label>
                  <select name="locationType" required value={editFormData.locationType} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none cursor-pointer transition-colors">
                    <option value="Зайнаас">Зайнаас</option>
                    <option value="Оффис">Оффис</option>
                    <option value="Холимог">Холимог</option>
                  </select>
                </div>
              </div>

              {editFormData.locationType !== 'Зайнаас' && (
                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 transition-colors">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-400 text-sm mb-3"> Хаяг засах</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <select name="city" value={editFormData.city} onChange={handleEditChange} className="w-full p-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm transition-colors">
                      <option value="Улаанбаатар">Улаанбаатар</option>
                    </select>
                    <select name="district" value={editFormData.district} onChange={handleEditDistrictChange} className="w-full p-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm cursor-pointer transition-colors">
                      <option value="" disabled>-- Дүүрэг --</option>
                      {Object.keys(LOCATION_DATA["Улаанбаатар"]).map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                    <select name="khoroo" value={editFormData.khoroo} onChange={handleEditChange} disabled={!editFormData.district} className="w-full p-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm cursor-pointer disabled:bg-gray-100 disabled:dark:bg-[#111111] transition-colors">
                      <option value="" disabled>-- Хороо --</option>
                      {Array.from({ length: khorooCount }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}-р хороо</option>
                      ))}
                    </select>
                  </div>
                  <input type="text" name="specificAddress" value={editFormData.specificAddress} onChange={handleEditChange} placeholder="Дэлгэрэнгүй хаяг..." className="w-full p-3 bg-white dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm transition-colors" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Цалин (₮)</label>
                  <input type="number" name="salary" required value={editFormData.salary} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Цалин бодох төрөл</label>
                  <select name="salaryType" required value={editFormData.salaryType} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer transition-colors">
                    <option value="цаг">Цагаар</option>
                    <option value="өдөр">Өдрөөр</option>
                    <option value="төсөл">Төслөөр</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Шаардлага</label>
                <textarea name="requirements" required value={editFormData.requirements} onChange={handleEditChange} rows="4" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-y transition-colors"></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors">Болих</button>
                <button type="submit" disabled={updating} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:bg-gray-400 disabled:dark:bg-gray-600">
                  {updating ? 'Хадгалж байна...' : ' Засварыг хадгалах'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;