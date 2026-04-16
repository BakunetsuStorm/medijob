import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Зөвхөн ажил хайгч (worker) л энэ хуудсыг харах эрхтэй
    if (!user || user.role !== 'worker') {
      navigate('/');
      return;
    }

    const fetchMyApps = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/applicant/${user._id}`);
        setApplications(response.data);
      } catch (error) {
        console.error("Хүсэлтүүдийг татахад алдаа гарлаа:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApps();
  }, [user, navigate]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Миний явуулсан хүсэлтүүд</h1>
            <p className="text-gray-500 font-medium mt-1">Та нийт {applications.length} ажилд хүсэлт илгээсэн байна.</p>
          </div>
          <Link to="/" className="text-blue-600 hover:underline font-bold">← Буцах</Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Одоогоор хүсэлт илгээгээгүй байна</h3>
            <Link to="/" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
              Ажил хайх
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{app.jobTitle}</h3>
                  <p className="text-gray-500 font-medium text-sm mt-1">Ажил олгогч: <span className="text-gray-800 font-bold">{app.employerName}</span></p>
                  <p className="text-gray-400 text-xs mt-2">Илгээсэн огноо: {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  {/* ТӨЛӨВ ХАРУУЛАХ ХЭСЭГ */}
                  {app.status === 'pending' && (
                    <span className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl text-sm font-bold w-full md:w-auto text-center">
                      ⏳ Хүлээгдэж байна
                    </span>
                  )}
                  {app.status === 'accepted' && (
                    <span className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold w-full md:w-auto text-center">
                      🎉 Тэнцсэн
                    </span>
                  )}
                  {app.status === 'rejected' && (
                    <span className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-bold w-full md:w-auto text-center">
                      ❌ Татгалзсан
                    </span>
                  )}
                  
                  <Link to={`/job/${app.jobId}`} className="text-sm text-blue-600 hover:underline font-bold mt-1">
                    Зар руу очих →
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;