import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// 🔥 ШИНЭ: Chart.js-ийн сангуудыг оруулж ирэх
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

// ChartJS-ийг бүртгэх
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('jobs'); 
  const [jobs, setJobs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [applications, setApplications] = useState([]); 
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-red-500"></div></div>;

  // --- СТАТИСТИКИЙН ТООЦООЛОЛ ---
  const totalUsers = usersList.length;
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const successApps = applications.filter(app => app.status === 'accepted' || app.status === 'completed').length;

  // 🔥 1. ХЭРЭГЛЭГЧДИЙН ХАРЬЦАА (Doughnut Chart Data)
  const workerCount = usersList.filter(u => u.role === 'worker').length;
  const employerCount = usersList.filter(u => u.role === 'employer').length;
  const adminCount = usersList.filter(u => u.role === 'admin').length;

  const roleChartData = {
    labels: ['Ажил хайгчид', 'Ажил олгогчид', 'Админ'],
    datasets: [
      {
        data: [workerCount, employerCount, adminCount],
        backgroundColor: ['#3b82f6', '#a855f7', '#ef4444'], // Улаан, Цэнхэр, Нил ягаан
        hoverBackgroundColor: ['#2563eb', '#9333ea', '#dc2626'],
        borderWidth: 0,
        hoverOffset: 10,
      },
    ],
  };

  const roleChartOptions = {
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Inter', weight: 'bold' } } },
    },
    cutout: '70%', // Голыг нь хэр их ухах вэ
  };

  // 🔥 2. АЖЛЫН АНГИЛЛУУД (Bar Chart Data)
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
        backgroundColor: 'rgba(249, 115, 22, 0.8)', // Жүржийн өнгө
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
      y: { beginAtZero: true, ticks: { precision: 0 } },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <span className="bg-red-500 text-white p-2.5 rounded-2xl shadow-lg shadow-red-500/30 text-2xl">⚙️</span>
              Системийн Удирдлага
            </h1>
            <p className="text-gray-500 mt-2 font-medium">MediJob платформын ерөнхий статистик болон хяналт</p>
          </div>
          <Link to="/" className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-black transition-colors shadow-sm">
            ← Вэб рүү буцах
          </Link>
        </div>

        {/* 4 Статистик Картууд */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт хэрэглэгч</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{totalUsers}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт ажлын байр</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{totalJobs}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт өргөдөл</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{totalApps}</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group border-b-4 border-b-green-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Амжилттай өргөдөл</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{successApps}</h3>
          </div>
        </div>

        {/* 🔥 ШИНЭЭР НЭМСЭН ГРАФИКИЙН ХЭСЭГ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Дугуй График */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-black text-gray-900 mb-6 w-full text-left">Хэрэглэгчдийн харьцаа</h3>
            <div className="w-full max-w-[250px] relative">
              <Doughnut data={roleChartData} options={roleChartOptions} />
              {/* Голд нь тоо харуулах */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-5">
                <span className="text-3xl font-black text-gray-900">{totalUsers}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Нийт</span>
              </div>
            </div>
          </div>

          {/* Баганан График */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2 flex flex-col justify-center">
            <h3 className="text-lg font-black text-gray-900 mb-6">Ажлын ангиллын эзлэх хувь</h3>
            <div className="w-full h-64">
              <Bar data={categoryChartData} options={categoryChartOptions} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 bg-white p-2 rounded-2xl w-fit border border-gray-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'jobs' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            Нийт зарууд
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            Нийт хэрэглэгчид
          </button>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {activeTab === 'jobs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs tracking-wider uppercase">
                  <tr>
                    <th className="p-5 font-black">Гарчиг</th>
                    <th className="p-5 font-black">Ажил олгогч</th>
                    <th className="p-5 font-black">Байршил</th>
                    <th className="p-5 font-black">Үүссэн</th>
                    <th className="p-5 font-black text-right">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {jobs.map(job => (
                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {job.title}
                      </td>
                      <td className="p-5 text-gray-600 font-medium">{job.employerName}</td>
                      <td className="p-5"><span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-md text-xs">{job.locationType}</span></td>
                      <td className="p-5 text-gray-400 font-medium">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 text-right">
                        <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition-colors">Устгах</button>
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
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs tracking-wider uppercase">
                  <tr>
                    <th className="p-5 font-black">Нэр</th>
                    <th className="p-5 font-black">И-мэйл</th>
                    <th className="p-5 font-black">Төрөл</th>
                    <th className="p-5 font-black">Бүртгүүлсэн</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {usersList.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 font-bold text-gray-900 flex items-center gap-3">
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt="img" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-black text-gray-500">{u.name.charAt(0)}</div>
                        )}
                        {u.name}
                      </td>
                      <td className="p-5 text-gray-500 font-medium">{u.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'employer' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-5 text-gray-400 font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;