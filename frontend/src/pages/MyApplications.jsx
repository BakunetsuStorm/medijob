import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Үнэлгээ өгөх цонхны State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ revieweeId: null, jobId: null, rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // 🔥 ШИНЭ: Компанийн профайл харах цонхны State
  const [selectedEmployerProfile, setSelectedEmployerProfile] = useState(null);
  const [employerReviews, setEmployerReviews] = useState([]);
  const [employerAvgRating, setEmployerAvgRating] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => { fetchMyApplications(); }, []);

  const fetchMyApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applications/worker', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error("Хүсэлт татахад алдаа гарлаа", error);
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (companyId, targetJobId) => {
    if (!companyId) {
      alert("⚠️ Компанийн мэдээлэл олдсонгүй!");
      return;
    }
    setReviewData({ revieweeId: companyId, jobId: targetJobId, rating: 5, comment: '' });
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await axios.post('http://localhost:5000/api/reviews', reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(' Үнэлгээ амжилттай илгээгдлээ! Баярлалаа.');
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Үнэлгээ өгөхөд алдаа гарлаа.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // 🔥 ШИНЭ: Компанийн профайл болон үнэлгээг татах функц
  const handleViewEmployerProfile = async (app) => {
    setSelectedEmployerProfile(app);
    setLoadingProfile(true);
    try {
      const companyId = app.employerId?._id || app.employerId || app.jobId?.employerId;
      const res = await axios.get(`http://localhost:5000/api/reviews/${companyId}`);
      setEmployerReviews(res.data.reviews || []);
      setEmployerAvgRating(res.data.averageRating || 0);
    } catch (error) {
      console.error("Үнэлгээ татахад алдаа гарлаа:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 transition-colors">Миний хүсэлтүүд</h2>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 font-bold">Уншиж байна...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-[#111111] p-10 rounded-2xl border border-gray-200 dark:border-gray-800 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Та одоогоор ямар ч ажилд хүсэлт илгээгээгүй байна.</p>
            <Link to="/" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Ажил хайх</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white dark:bg-[#111111] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{app.jobId?.title || 'Устгагдсан ажил'}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-gray-500 dark:text-gray-400 font-medium transition-colors">{app.employerName || app.jobId?.employerName || 'Тодорхойгүй компани'}</p>
                    
                    {/* 🔥 ШИНЭ: Компанийн профайл харах жижиг товч */}
                    <button onClick={() => handleViewEmployerProfile(app)} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold flex items-center gap-1 transition-colors bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                       Профайл харах
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    app.status === 'accepted' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    app.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                  }`}>
                    {app.status === 'accepted' ? ' Тэнцсэн' : 
                     app.status === 'completed' ? ' Ажил дууссан' : 
                     app.status === 'rejected' ? ' Татгалзсан' : ' Хүлээгдэж байна'}
                  </span>

                  {(app.status === 'accepted' || app.status === 'completed') && (
                    <button onClick={() => openReviewModal(app.employerId?._id || app.employerId || app.jobId?.employerId, app.jobId?._id || app.jobId)} className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                        Дүгнэх
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ҮНЭЛГЭЭ ӨГӨХ МОДАЛ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 max-w-md w-full shadow-2xl border dark:border-gray-800 transition-colors duration-300">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Үнэлгээ өгөх</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">Ажил олгогчийн харилцаа, ажлын орчин ямар байсан бэ?</p>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewData({ ...reviewData, rating: star })} className="focus:outline-none transition-transform hover:scale-110">
                    <svg className={`w-10 h-10 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Сэтгэгдэл (Заавал биш)</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors" placeholder="Энд сэтгэгдлээ үлдээнэ үү..." value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}></textarea>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors">Болих</button>
                <button type="submit" disabled={submittingReview} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:bg-gray-400 disabled:dark:bg-gray-600">
                  {submittingReview ? 'Илгээж байна...' : 'Илгээх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 ШИНЭ: КОМПАНИЙН ПРОФАЙЛ ХАРАХ МОДАЛ */}
      {selectedEmployerProfile && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#111111] rounded-3xl w-full max-w-4xl shadow-2xl my-8 relative overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 border dark:border-gray-800">
            
            {/* Толгойн хэсэг */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 p-8 text-white relative shrink-0 transition-colors">
              <button onClick={() => setSelectedEmployerProfile(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white text-purple-600 dark:bg-[#1a1a1a] dark:text-purple-400 flex items-center justify-center text-4xl font-black shadow-xl">
                  {selectedEmployerProfile.employerId?.profilePicture ? (
                    <img src={selectedEmployerProfile.employerId.profilePicture} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    (selectedEmployerProfile.employerName || selectedEmployerProfile.jobId?.employerName || 'C').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-black mb-1">{selectedEmployerProfile.employerName || selectedEmployerProfile.jobId?.employerName || 'Тодорхойгүй компани'}</h2>
                  <p className="text-purple-100 dark:text-purple-200 font-medium mb-3">{selectedEmployerProfile.employerId?.email || 'Мэдээлэл алга'}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{selectedEmployerProfile.employerId?.companyIndustry || 'Салбар тодорхойгүй'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Бие хэсэг */}
            <div className="p-8 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] flex-grow transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Зүүн багана */}
                <div className="md:col-span-1 space-y-6">
                  
                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center transition-colors">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Нийт үнэлгээ</h3>
                    {loadingProfile ? (
                      <div className="animate-pulse h-12 bg-gray-200 dark:bg-gray-800 rounded mt-2"></div>
                    ) : (
                      <>
                        <div className="text-4xl font-black text-yellow-400 mb-1">⭐ {employerAvgRating}</div>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{employerReviews.length} хүний үнэлгээ</p>
                      </>
                    )}
                  </div>

                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Холбоо барих</h3>
                    <div className="space-y-3">
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Вэбсайт:</p><p className="font-bold text-blue-600 dark:text-blue-400 break-words">{selectedEmployerProfile.employerId?.website ? <a href={`https://${selectedEmployerProfile.employerId.website.replace('https://', '')}`} target="_blank" rel="noreferrer" className="hover:underline">{selectedEmployerProfile.employerId.website}</a> : '-'}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Регистр:</p><p className="font-bold text-gray-900 dark:text-white">{selectedEmployerProfile.employerId?.companyRegNumber || '-'}</p></div>
                    </div>
                  </div>

                  {(selectedEmployerProfile.status === 'accepted' || selectedEmployerProfile.status === 'completed') && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-900/50 text-center transition-colors">
                       <p className="text-xs font-black text-green-600 dark:text-green-500 uppercase tracking-widest mb-1">Утасны дугаар</p>
                       <p className="text-xl font-black text-green-800 dark:text-green-400">{selectedEmployerProfile.employerId?.phone || 'Оруулаагүй байна'}</p>
                    </div>
                  )}
                </div>

                {/* Баруун багана */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">Байгууллагын танилцуулга</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedEmployerProfile.employerId?.bio || 'Танилцуулга оруулаагүй байна.'}</p>
                  </div>

                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Ажилчдын сэтгэгдэл</h3>
                    {loadingProfile ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ачаалж байна...</p>
                    ) : employerReviews.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-[#111111] p-4 rounded-xl">Одоогоор сэтгэгдэл алга байна.</p>
                    ) : (
                      <div className="space-y-4">
                        {employerReviews.map(rev => (
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
          </div>
        </div>
      )}

    </div>
  );
};

export default MyApplications;