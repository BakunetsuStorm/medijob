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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '', title: '', category: '', salary: '', salaryType: '', locationType: '', 
    city: 'Улаанбаатар', district: '', khoroo: '', specificAddress: '', requirements: ''
  });

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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const khorooCount = editFormData.district ? LOCATION_DATA["Улаанбаатар"][editFormData.district] : 0;

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Миний зарууд</h1>
            <p className="text-gray-500 font-medium text-sm">Таны нийтэлсэн ажлын байрууд</p>
          </div>
          <Link to="/" className="text-blue-600 hover:underline font-bold">← Буцах</Link>
        </div>

        <div className="space-y-4">
          {myJobs.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center text-gray-500">
               Та одоогоор зар оруулаагүй байна.
            </div>
          ) : (
            myJobs.map(job => (
              <div key={job._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex-grow w-full">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{job.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{job.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{job.locationType} • {job.salary.toLocaleString()}₮ / {job.salaryType}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button onClick={() => fetchApplications(job._id)} className={`px-4 py-2 font-bold rounded-xl text-sm w-full sm:w-auto ${activeJobId === job._id ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'}`}>
                      {activeJobId === job._id ? 'Хаах' : 'Хүсэлт харах'}
                    </button>
                    <button onClick={() => openEditModal(job)} className="px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-xl text-sm"> Засах</button>
                    <button onClick={() => handleDelete(job._id)} className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-sm">Устгах</button>
                  </div>
                </div>

                {activeJobId === job._id && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                      <span className="bg-blue-600 w-2 h-6 rounded-full"></span>
                      Ирсэн хүсэлтүүд ({applications.length})
                    </h4>
                    
                    {applications.length === 0 ? (
                      <p className="text-gray-500 text-sm italic bg-gray-50 p-6 rounded-xl text-center">Одоогоор хүсэлт ирээгүй байна.</p>
                    ) : (
                      <div className="space-y-6">
                        {applications.map(app => (
                          <div key={app._id} className={`p-6 rounded-3xl border transition-all ${app.status === 'accepted' ? 'bg-green-50/50 border-green-200' : app.status === 'rejected' ? 'bg-red-50/30 border-red-100' : 'bg-white border-gray-200 shadow-sm'}`}>
                            
                            {/* Толгой мэдээлэл (Зураг, Нэр, Товчнууд) */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg shrink-0 overflow-hidden bg-blue-600 text-white border-2 border-white">
                                  {app.applicantId?.profilePicture ? (
                                    <img src={app.applicantId.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                  ) : (
                                    app.applicantName?.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="font-black text-gray-900 text-lg">{app.applicantName}</p>
                                  <div className="flex items-center gap-3">
                                    <a href={`mailto:${app.applicantEmail}`} className="text-xs text-blue-600 hover:underline font-bold">{app.applicantEmail}</a>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter bg-gray-100 px-2 py-0.5 rounded">{new Date(app.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                {app.status === 'pending' ? (
                                  <div className="flex gap-2">
                                    <button onClick={() => handleUpdateStatus(app._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all">✅ ЗӨВШӨӨРӨХ</button>
                                    <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl text-xs font-black transition-all">❌ ТАТГАЛЗАХ</button>
                                  </div>
                                ) : (
                                  <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${app.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                    {app.status === 'accepted' ? ' Тэнцүүлсэн' : 'Татгалзсан'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Ажил горилогчийн зурвас */}
                            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mb-6">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Зурвас:</p>
                               <p className="text-sm text-gray-700 leading-relaxed italic">"{app.coverLetter}"</p>
                            </div>

                            {/* 🔥 ХОЛБОО БАРИХ (УТАСНЫ ДУГААР) ХЭСЭГ */}
                            <div className="mb-6 flex items-center justify-center sm:justify-start">
                              {(app.status === 'accepted' || app.status === 'completed') ? (
                                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl animate-in fade-in zoom-in duration-300">
                                  <div className="bg-green-100 p-2 rounded-full"></div>
                                  <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">Утасны дугаар</p>
                                    <p className="font-black text-lg tracking-wide">{app.applicantId?.phone || 'Оруулаагүй байна'}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-500 px-4 py-3 rounded-xl">
                                  <span></span>
                                  <p className="text-xs font-bold">Утасны дугаар нууцлагдсан <span className="font-medium opacity-70">(Зөвшөөрсний дараа харагдана)</span></p>
                                </div>
                              )}
                            </div>

                            {/* CV МЭДЭЭЛЭЛ ХАРУУЛАХ ХЭСЭГ */}
                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200/60 shadow-inner">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center md:text-left">
                                <div><p className="text-[11px] font-bold text-gray-400 uppercase">Мэргэжил</p><p className="font-bold text-gray-900 text-sm">{app.applicantId?.profession || '-'}</p></div>
                                <div><p className="text-[11px] font-bold text-gray-400 uppercase">Нас / Хүйс</p><p className="font-bold text-gray-900 text-sm">{app.applicantId?.age ? `${app.applicantId.age} нас` : '-'} / {app.applicantId?.gender || '-'}</p></div>
                                <div className="col-span-2"><p className="text-[11px] font-bold text-gray-400 uppercase">Ур чадварууд</p><p className="font-bold text-blue-600 text-sm">{app.applicantId?.skills || '-'}</p></div>
                              </div>
                              <p className="text-[11px] font-bold text-gray-400 uppercase mb-1">Танилцуулга</p>
                              <p className="text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">{app.applicantId?.bio || 'Танилцуулгагүй.'}</p>
                            </div>
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

      {/* 🔥 ЗАСАХ МОДАЛ ЦОНХ */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-2xl my-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Ажлын зар засах</h3>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ажлын гарчиг</label>
                <input type="text" name="title" required value={editFormData.title} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ажлын ангилал</label>
                  <select name="category" required value={editFormData.category} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer">
                    <option value="Вэб хөгжүүлэлт">Вэб хөгжүүлэлт</option>
                    <option value="График дизайн">График дизайн</option>
                    <option value="Орчуулга">Орчуулга</option>
                    <option value="Маркетинг">Маркетинг</option>
                    <option value="Бусад">Бусад</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ажиллах хэлбэр</label>
                  <select name="locationType" required value={editFormData.locationType} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none cursor-pointer">
                    <option value="Зайнаас">Зайнаас</option>
                    <option value="Оффис">Оффис</option>
                    <option value="Холимог">Холимог</option>
                  </select>
                </div>
              </div>

              {editFormData.locationType !== 'Зайнаас' && (
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 text-sm mb-3"> Хаяг засах</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <select name="city" value={editFormData.city} onChange={handleEditChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm">
                      <option value="Улаанбаатар">Улаанбаатар</option>
                    </select>
                    <select name="district" value={editFormData.district} onChange={handleEditDistrictChange} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm cursor-pointer">
                      <option value="" disabled>-- Дүүрэг --</option>
                      {Object.keys(LOCATION_DATA["Улаанбаатар"]).map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                    <select name="khoroo" value={editFormData.khoroo} onChange={handleEditChange} disabled={!editFormData.district} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm cursor-pointer">
                      <option value="" disabled>-- Хороо --</option>
                      {Array.from({ length: khorooCount }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}-р хороо</option>
                      ))}
                    </select>
                  </div>
                  <input type="text" name="specificAddress" value={editFormData.specificAddress} onChange={handleEditChange} placeholder="Дэлгэрэнгүй хаяг..." className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Цалин (₮)</label>
                  <input type="number" name="salary" required value={editFormData.salary} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Цалин бодох төрөл</label>
                  <select name="salaryType" required value={editFormData.salaryType} onChange={handleEditChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer">
                    <option value="цаг">Цагаар</option>
                    <option value="өдөр">Өдрөөр</option>
                    <option value="төсөл">Төслөөр</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Шаардлага</label>
                <textarea name="requirements" required value={editFormData.requirements} onChange={handleEditChange} rows="4" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none resize-y"></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Болих</button>
                <button type="submit" disabled={updating} className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:bg-gray-400">
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