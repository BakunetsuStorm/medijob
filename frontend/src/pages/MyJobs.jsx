import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LOCATION_DATA = {
  "Улаанбаатар": {
    "Багануур дүүрэг": 5, "Багахангай дүүрэг": 2, "Баянгол дүүрэг (БГД)": 34,
    "Баянзүрх дүүрэг (БЗД)": 43, "Налайх дүүрэг": 8, "Сүхбаатар дүүрэг (СБД)": 20, "Сонгинохайрхан дүүрэг (СХД)": 43,
    "Хан-Уул дүүрэг (ХУД)": 25, "Чингэлтэй дүүрэг (ЧД)": 24
  }
};

const MyJobs = () => {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeJobId, setActiveJobId] = useState(null);
  const [applications, setApplications] = useState([]);

  // Засах модал
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '', title: '', category: '', salary: '', salaryType: '', locationType: '', 
    city: 'Улаанбаатар', district: '', khoroo: '', specificAddress: '', requirements: ''
  });

  // Дэлгэрэнгүй CV харах модалын State
  const [selectedAppCV, setSelectedAppCV] = useState(null);
  const [applicantReviews, setApplicantReviews] = useState([]);
  const [applicantAvgRating, setApplicantAvgRating] = useState(0);
  const [loadingCV, setLoadingCV] = useState(false);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        const filteredJobs = response.data.filter(job => job.employerId === user?._id);
        setMyJobs(filteredJobs);
      } catch (error) {
        console.error("Алдаа:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyJobs();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Энэхүү зарыг устгахдаа итгэлтэй байна уу?")) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMyJobs(myJobs.filter(job => job._id !== id));
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
      setMyJobs(myJobs.map(job => job._id === editFormData._id ? response.data : job));
      alert("Амжилттай засагдлаа!");
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

  const fetchApplications = async (jobId) => {
    if (activeJobId === jobId) {
      setActiveJobId(null);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`);
      setApplications(res.data);
      setActiveJobId(jobId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    const confirmMsg = newStatus === 'accepted' ? "Ажилд авах уу?" : "Татгалзах уу?";
    if (window.confirm(confirmMsg)) {
      try {
        await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setApplications(applications.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        
        if (selectedAppCV && selectedAppCV._id === appId) {
          setSelectedAppCV({ ...selectedAppCV, status: newStatus });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleViewCV = async (app) => {
    setSelectedAppCV(app);
    setLoadingCV(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${app.applicantId._id}`);
      setApplicantReviews(res.data.reviews || []);
      setApplicantAvgRating(res.data.averageRating || 0);
    } catch (error) {
      console.error("Үнэлгээ татахад алдаа гарлаа:", error);
    } finally {
      setLoadingCV(false);
    }
  };

  const khorooCount = editFormData.district ? LOCATION_DATA["Улаанбаатар"][editFormData.district] : 0;

  if (loading) return <div className="min-h-screen flex justify-center items-center dark:bg-[#0a0a0a]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] py-12 px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white transition-colors">Миний зарууд</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors">Таны нийтэлсэн ажлын байрууд</p>
          </div>
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors">← Буцах</Link>
        </div>

        <div className="space-y-4">
          {myJobs.length === 0 ? (
            <div className="bg-white dark:bg-[#111111] p-10 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 transition-colors">
               Та одоогоор зар оруулаагүй байна.
            </div>
          ) : (
            myJobs.map(job => (
              <div key={job._id} className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex-grow w-full">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md uppercase tracking-wider transition-colors">{job.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 transition-colors">{job.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">{job.locationType} • {job.salary.toLocaleString()}₮ / {job.salaryType}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button onClick={() => fetchApplications(job._id)} className={`px-4 py-2 font-bold rounded-xl text-sm w-full sm:w-auto transition-all ${activeJobId === job._id ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'}`}>
                      {activeJobId === job._id ? 'Хүсэлт хаах' : 'Хүсэлт харах'}
                    </button>
                    <button onClick={() => openEditModal(job)} className="px-4 py-2 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 font-bold rounded-xl text-sm transition-all"> Засах</button>
                    <button onClick={() => handleDelete(job._id)} className="px-4 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-xl text-sm transition-all">Устгах</button>
                  </div>
                </div>

                {activeJobId === job._id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 transition-colors">
                    <h4 className="font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
                      <span className="bg-blue-600 dark:bg-blue-500 w-2 h-6 rounded-full"></span>
                      Ирсэн хүсэлтүүд ({applications.length})
                    </h4>
                    
                    {applications.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-xl text-center transition-colors">Одоогоор хүсэлт ирээгүй байна.</p>
                    ) : (
                      <div className="space-y-4">
                        {applications.map(app => (
                          <div key={app._id} className={`p-5 rounded-2xl border transition-all duration-300 ${app.status === 'accepted' ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : app.status === 'rejected' ? 'bg-red-50/30 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 shadow-sm'}`}>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-sm shrink-0 overflow-hidden bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                  {app.applicantId?.profilePicture ? (
                                    <img src={app.applicantId.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                    app.applicantName?.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 dark:text-white text-lg transition-colors">{app.applicantName}</p>
                                  <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tighter bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded transition-colors">{new Date(app.createdAt).toLocaleDateString()}</span>
                                    <button onClick={() => handleViewCV(app)} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold flex items-center gap-1 transition-colors">
                                      📄 Дэлгэрэнгүй CV & Үнэлгээ
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {app.status === 'pending' ? (
                                  <div className="flex gap-2">
                                    <button onClick={() => handleUpdateStatus(app._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black transition-all">✅ ЗӨВШӨӨРӨХ</button>
                                    <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="bg-white dark:bg-[#222222] border border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl text-xs font-black transition-all">❌ ТАТГАЛЗАХ</button>
                                  </div>
                                ) : (
                                  <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors ${app.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50'}`}>
                                    {app.status === 'accepted' ? ' Тэнцүүлсэн' : 'Татгалзсан'}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 bg-gray-50 dark:bg-[#111111] p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                               <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{app.coverLetter}"</p>
                            </div>

                            {(app.status === 'accepted' || app.status === 'completed') && (
                              <div className="mt-4 flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400 px-5 py-3 rounded-xl animate-in fade-in zoom-in duration-300 transition-colors">
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Холбогдох утас</p>
                                  <p className="font-black text-lg tracking-wide">{app.applicantId?.phone || 'Оруулаагүй байна'}</p>
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* =========================================
          🔥 ШИНЭ: ДЭЛГЭРЭНГҮЙ CV & ҮНЭЛГЭЭНИЙ МОДАЛ
          ========================================= */}
      {selectedAppCV && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#111111] rounded-3xl w-full max-w-4xl shadow-2xl my-8 relative overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 border dark:border-gray-800">
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 p-8 text-white relative shrink-0 transition-colors">
              <button onClick={() => setSelectedAppCV(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white text-blue-600 dark:bg-[#1a1a1a] dark:text-blue-400 flex items-center justify-center text-4xl font-black shadow-xl">
                  {selectedAppCV.applicantId?.profilePicture ? (
                    <img src={selectedAppCV.applicantId.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    selectedAppCV.applicantName?.charAt(0)
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-black mb-1">{selectedAppCV.applicantName}</h2>
                  <p className="text-blue-100 dark:text-blue-200 font-medium mb-3">{selectedAppCV.applicantEmail}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {selectedAppCV.applicantId?.professions?.length > 0 ? (
                      selectedAppCV.applicantId.professions.map((prof, idx) => (
                        <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{prof}</span>
                      ))
                    ) : (
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{selectedAppCV.applicantId?.profession || 'Мэргэжил тодорхойгүй'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] flex-grow transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Ерөнхий мэдээлэл</h3>
                    <div className="space-y-3">
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Нас:</p><p className="font-bold text-gray-900 dark:text-white">{selectedAppCV.applicantId?.age ? `${selectedAppCV.applicantId.age} настай` : '-'}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Хүйс:</p><p className="font-bold text-gray-900 dark:text-white">{selectedAppCV.applicantId?.gender || '-'}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Ур чадвар:</p><p className="font-bold text-blue-600 dark:text-blue-400">{selectedAppCV.applicantId?.skills || '-'}</p></div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center transition-colors">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Нийт үнэлгээ</h3>
                    {loadingCV ? (
                      <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
                    ) : (
                      <>
                        <div className="text-4xl font-black text-yellow-400 mb-1">⭐ {applicantAvgRating}</div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{applicantReviews.length} хүний үнэлгээ</p>
                      </>
                    )}
                  </div>

                  {(selectedAppCV.status === 'accepted' || selectedAppCV.status === 'completed') && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-900/50 text-center transition-colors">
                       <p className="text-xs font-black text-green-600 dark:text-green-500 uppercase tracking-widest mb-1">Утасны дугаар</p>
                       <p className="text-xl font-black text-green-800 dark:text-green-400">{selectedAppCV.applicantId?.phone || '-'}</p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">Танилцуулга</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedAppCV.applicantId?.bio || 'Танилцуулга оруулаагүй байна.'}</p>
                  </div>

                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Ажлын туршлага</h3>
                    {(!selectedAppCV.applicantId?.experience || selectedAppCV.applicantId.experience.length === 0) ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">Ажлын туршлага оруулаагүй байна.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedAppCV.applicantId.experience.map((exp, idx) => (
                          <div key={idx} className="border-l-2 border-blue-200 dark:border-blue-800 pl-4 py-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">{exp.title}</h4>
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">{exp.company} <span className="text-gray-400 dark:text-gray-500 font-medium">• {exp.duration}</span></p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Өмнөх ажил олгогчдын сэтгэгдэл</h3>
                    {loadingCV ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ачаалж байна...</p>
                    ) : applicantReviews.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-[#111111] p-4 rounded-xl">Одоогоор сэтгэгдэл алга байна.</p>
                    ) : (
                      <div className="space-y-4">
                        {applicantReviews.map(rev => (
                          <div key={rev._id} className="bg-gray-50 dark:bg-[#111111] p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold text-gray-900 dark:text-white text-sm">{rev.reviewerId?.name || 'Нэр нууцлагдсан'}</span>
                              <span className="text-yellow-500 text-xs font-black">⭐ {rev.rating}/5</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{rev.comment}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {selectedAppCV.status === 'pending' && (
              <div className="bg-white dark:bg-[#111111] p-6 border-t border-gray-100 dark:border-gray-800 flex gap-4 shrink-0 transition-colors">
                <button onClick={() => handleUpdateStatus(selectedAppCV._id, 'rejected')} className="flex-1 py-3.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-xl transition-all">
                  ❌ ТАТГАЛЗАХ
                </button>
                <button onClick={() => handleUpdateStatus(selectedAppCV._id, 'accepted')} className="flex-1 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all">
                  ✅ АЖИЛД АВАХ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-2xl my-8 transition-colors duration-300 border dark:border-gray-800">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Ажлын зар засах</h3>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ажлын гарчиг</label>
                <input type="text" name="title" required value={editFormData.title} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ажлын ангилал</label>
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
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Ажиллах хэлбэр</label>
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
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Цалин (₮)</label>
                  <input type="number" name="salary" required value={editFormData.salary} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Цалин бодох төрөл</label>
                  <select name="salaryType" required value={editFormData.salaryType} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer transition-colors">
                    <option value="цаг">Цагаар</option>
                    <option value="өдөр">Өдрөөр</option>
                    <option value="төсөл">Төслөөр</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Шаардлага</label>
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

export default MyJobs;