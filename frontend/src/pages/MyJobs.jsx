import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyJobs = () => {
  const { user } = useContext(AuthContext);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Хүсэлтүүдийг харах төлөв
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
      setActiveJobId(null); // Дахиад дарвал хаана
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

              {/* Хүсэлтүүд дэлгэгдэж харагдах хэсэг */}
              {activeJobId === job._id && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4">Ирсэн хүсэлтүүд ({applications.length})</h4>
                  {applications.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Одоогоор хүсэлт ирээгүй байна.</p>
                  ) : (
                    <div className="space-y-3">
                      {applications.map(app => (
                        <div key={app._id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-gray-900">{app.applicantName}</p>
                              <a href={`mailto:${app.applicantEmail}`} className="text-sm text-blue-600 hover:underline">{app.applicantEmail}</a>
                            </div>
                            <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">{app.coverLetter}</p>
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