import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('jobs'); 
  const [jobs, setJobs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [applications, setApplications] = useState([]); // Өргөдлүүд
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      // 3 API-г тус тусад нь дуудах (Нэг нь унасан ч бусад нь ажиллана)
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
        await axios.delete(`http://localhost:5000/api/jobs/${id}`);
        setJobs(jobs.filter(job => job._id !== id));
      } catch (error) {
        alert("Устгахад алдаа гарлаа.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-red-500"></div></div>;

  // Статистикийн тооцоолол
  const totalUsers = usersList.length;
  const totalJobs = jobs.length;
  const totalApps = applications.length;
  const successApps = applications.filter(app => app.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <span className="bg-red-500 text-white p-2.5 rounded-2xl shadow-lg shadow-red-500/30 text-2xl"></span>
              Системийн Удирдлага
            </h1>
            <p className="text-gray-500 mt-2 font-medium">MediJob платформын ерөнхий статистик болон хяналт</p>
          </div>
          <Link to="/" className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 hover:text-black transition-colors shadow-sm">
            ← Вэб рүү буцах
          </Link>
        </div>

        {/* 4 Статистик Картууд */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт хэрэглэгч</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{totalUsers}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-blue-600 relative z-10">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Ажилчид & Олгогчид
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт ажлын байр</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{totalJobs}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-purple-600 relative z-10">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Идэвхтэй зарууд
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Нийт өргөдөл</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{totalApps}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-orange-600 relative z-10">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Илгээгдсэн CV
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group border-b-4 border-b-green-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2 relative z-10">Амжилттай өргөдөл</p>
            <h3 className="text-4xl font-black text-gray-900 relative z-10">{successApps}</h3>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-green-600 relative z-10">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Ажилд тэнцсэн хүмүүс
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
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm tracking-wider uppercase">
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
                <thead className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-sm tracking-wider uppercase">
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
                      <td className="p-5 font-bold text-gray-900">{u.name}</td>
                      <td className="p-5 text-gray-500">{u.email}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'employer' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
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