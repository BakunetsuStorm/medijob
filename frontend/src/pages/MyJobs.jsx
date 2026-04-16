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
        const filteredJobs = response.data.filter(job => job.employerName === user?.name);
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
        await axios.delete(`http://localhost:5000/api/jobs/${id}`);
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
        await axios.put(`http://localhost:5000/api/applications/${appId}/status`, { status: newStatus });
        
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
          </div>
          <Link to="/" className="text-blue-600 hover:underline font-bold">← Буцах</Link>
        </div>

        <div className="space-y-4">
          {myJobs.map(job => (
            <div key={job._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-shadow">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex-grow w-full">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">{job.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">{job.title}</h3>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button onClick={() => fetchApplications(job._id)} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 text-sm w-full sm:w-auto">
                    Ирсэн хүсэлт харах
                  </button>
                  <button onClick={() => handleDelete(job._id)} className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 text-sm">Устгах</button>
                </div>
              </div>

              {activeJobId === job._id && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Ирсэн хүсэлтүүд ({applications.length})</h4>
                  {applications.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Одоогоор хүсэлт ирээгүй байна.</p>
                  ) : (
                    <div className="space-y-4">
                      {applications.map(app => (
                        <div key={app._id} className={`p-5 rounded-xl border ${app.status === 'accepted' ? 'bg-green-50 border-green-200' : app.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                          
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                            <div>
                              <p className="font-bold text-gray-900 text-lg">{app.applicantName}</p>
                              <a href={`mailto:${app.applicantEmail}`} className="text-sm text-blue-600 hover:underline font-medium">{app.applicantEmail}</a>
                              <span className="text-xs text-gray-400 ml-3">{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <div>
                              {app.status === 'pending' ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleUpdateStatus(app._id, 'accepted')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                    ✅ Ажилд авах
                                  </button>
                                  <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                    ❌ Татгалзах
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider ${app.status === 'accepted' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                  {app.status === 'accepted' ? '🎉 Тэнцсэн' : 'Татгалзсан'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Илгээсэн захидал (Cover Letter) */}
                          <p className="text-gray-700 text-sm mt-3 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-100">
                            <span className="font-bold text-gray-500 block mb-1">Илгээсэн захидал:</span>
                            {app.coverLetter}
                          </p>

                          {/* CV МЭДЭЭЛЭЛ ХАРУУЛАХ ХЭСЭГ */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Мэргэжил</p>
                              <p className="font-bold text-gray-900 text-sm">{app.profession}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ур чадвар</p>
                              <p className="font-medium text-blue-600 text-sm">{app.skills}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Туршлага</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.experience}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Танилцуулга</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.bio}</p>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;