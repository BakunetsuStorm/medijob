import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyJobs = () => {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeJobId, setActiveJobId] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs");
        // Ажил олгогчийн өөрийнх нь ID-аар шүүнэ
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
    const confirmMsg = newStatus === 'accepted' 
      ? "Энэ хүнийг үнэхээр ажилд авах уу?" 
      : "Энэ хүнд татгалзсан хариу өгөх үү?";
      
    if (window.confirm(confirmMsg)) {
      try {
        await axios.put(`http://localhost:5000/api/applications/${appId}/status`, 
          { status: newStatus },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        setApplications(applications.map(app => 
          app._id === appId ? { ...app, status: newStatus } : app
        ));
      } catch (error) {
        console.error(error);
        alert("Төлөв өөрчлөхөд алдаа гарлаа.");
      }
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Миний зарууд</h1>
            <p className="text-gray-500 font-medium text-sm">Таны нийтэлсэн ажлын байрууд болон ирсэн хүсэлтүүд</p>
          </div>
          <Link to="/" className="text-blue-600 hover:underline font-bold transition-all flex items-center gap-2">
             ← Буцах
          </Link>
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
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => fetchApplications(job._id)} 
                      className={`px-5 py-2.5 font-bold rounded-xl transition-all text-sm w-full sm:w-auto ${activeJobId === job._id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                      {activeJobId === job._id ? 'Хаах' : 'Хүсэлтүүд харах'}
                    </button>
                    <button onClick={() => handleDelete(job._id)} className="px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 text-sm">Устгах</button>
                  </div>
                </div>

                {activeJobId === job._id && (
                  <div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
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
                            
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">
                                  {app.applicantName?.charAt(0)}
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
                                    <button onClick={() => handleUpdateStatus(app._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95">
                                      ✅ ЗӨВШӨӨРӨХ
                                    </button>
                                    <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="bg-white border border-red-200 text-red-500 hover:bg-red-50 px-5 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95">
                                      ❌ ТАТГАЛЗАХ
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${app.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                    {app.status === 'accepted' ? '🎉 Тэнцүүлсэн' : 'Татгалзсан'}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 mb-6">
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ажил горилогчийн зурвас:</p>
                               <p className="text-sm text-gray-700 leading-relaxed italic">"{app.coverLetter}"</p>
                            </div>

                            {/* CV МЭДЭЭЛЭЛ ХАРУУЛАХ ХЭСЭГ (ШИНЭЧИЛСЭН МЭРГЭЖЛИЙН ДИЗАЙН) */}
                            <div className="bg-slate-50/80 p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-inner">
                              <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-sm">📄</div>
                                <h5 className="font-black text-gray-900 text-lg">Ажилтны дэлгэрэнгүй CV</h5>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center md:text-left">
                                <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Мэргэжил</p>
                                  <p className="font-bold text-gray-900 text-sm">{app.applicantId?.profession || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Нас / Хүйс</p>
                                  <p className="font-bold text-gray-900 text-sm">
                                    {app.applicantId?.age ? `${app.applicantId.age} нас` : '-'} / {app.applicantId?.gender || '-'}
                                  </p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Онцлох ур чадварууд</p>
                                  <p className="font-bold text-blue-600 text-sm">{app.applicantId?.skills || '-'}</p>
                                </div>
                              </div>
                              
                              <div className="mb-8">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Товч танилцуулга (Bio)</p>
                                <p className="text-sm text-gray-700 leading-relaxed bg-white p-5 rounded-xl border border-gray-100 shadow-sm whitespace-pre-wrap">
                                  {app.applicantId?.bio || 'Танилцуулга оруулаагүй байна.'}
                                </p>
                              </div>

                              <div>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 text-center md:text-left">Ажлын туршлагын түүх</p>
                                {Array.isArray(app.applicantId?.experience) && app.applicantId.experience.length > 0 ? (
                                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-gray-200 before:to-transparent">
                                    {app.applicantId.experience.map((exp, idx) => (
                                      <div key={idx} className="relative flex items-start group pl-12">
                                        <div className="absolute left-0 mt-1 w-9 h-9 rounded-full border-4 border-slate-50 bg-blue-100 text-blue-600 shadow-sm flex items-center justify-center text-xs z-10 transition-transform group-hover:scale-110">💼</div>
                                        <div className="w-full bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                                            <p className="text-base font-black text-gray-900">{exp.title}</p>
                                            <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{exp.duration}</span>
                                          </div>
                                          <p className="text-xs font-bold text-blue-600 mb-3">{exp.company}</p>
                                          <p className="text-sm text-gray-600 leading-relaxed font-medium">{exp.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 italic bg-white p-5 rounded-xl border border-gray-100 text-center shadow-sm">Ажлын түүх оруулаагүй байна.</p>
                                )}
                              </div>
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
    </div>
  );
};

export default MyJobs;