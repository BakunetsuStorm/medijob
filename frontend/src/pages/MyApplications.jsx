import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Хоёр талт үнэлгээний цонхны State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    revieweeId: null,
    jobId: null,
    rating: 5, 
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchMyApplications();
  }, []);

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

  // АЛДАА ЗАССАН: ID-ууд орж ирж байгаа эсэхийг баталгаажуулж шалгах
  // Үнэлгээ өгөх цонх нээх функц (УХААЛАГ ХАЙЛТ)
  const openReviewModal = (companyId, targetJobId) => {
    if (!companyId) {
      alert("⚠️ Компанийн мэдээлэл олдсонгүй! Энэ нь хуучин эвдэрхий дата эсвэл устгагдсан ажил байж магадгүй байна.");
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
      alert('⭐️ Үнэлгээ амжилттай илгээгдлээ! Баярлалаа.');
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Үнэлгээ өгөхөд алдаа гарлаа.');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 mb-8">Миний хүсэлтүүд</h2>

        {loading ? (
          <p className="text-gray-500 font-bold">Уншиж байна...</p>
        ) : applications.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center">
            <p className="text-gray-500 mb-4 font-medium">Та одоогоор ямар ч ажилд хүсэлт илгээгээгүй байна.</p>
            <Link to="/" className="text-blue-600 font-bold hover:underline">Ажил хайх</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{app.jobId?.title || 'Устгагдсан ажил'}</h3>
                  <p className="text-gray-500 font-medium">{app.employerName || app.jobId?.employerName}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* ШИНЭЧЛЭГДСЭН: 'completed' буюу Ажил дууссан төлөвийг нэмсэн */}
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                    app.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                    app.status === 'completed' ? 'bg-green-100 text-green-700' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status === 'accepted' ? '🎉 Тэнцсэн' : 
                     app.status === 'completed' ? '✅ Ажил дууссан' : 
                     app.status === 'rejected' ? '❌ Татгалзсан' : '⏳ Хүлээгдэж байна'}
                  </span>

                      
                  {/* */}
                  {(app.status === 'accepted' || app.status === 'completed') && (
                    <button 
                      onClick={() => {
                        // Backend-ээс ирсэн мэдээллээс компанийн ID-г баталгаатай олж авах
                        const companyId = app.employerId || app.jobId?.employerId;
                        const targetJobId = app.jobId?._id || app.jobId;
                        openReviewModal(companyId, targetJobId);
                      }}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
                    >
                      ⭐️ Компанийг дүгнэх
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ҮНЭЛГЭЭ ӨГӨХ МОДАЛ ЦОНХ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Үнэлгээ өгөх</h3>
            <p className="text-gray-500 text-sm font-medium mb-6">Ажил олгогчийн харилцаа, ажлын орчин ямар байсан бэ?</p>
            
            <form onSubmit={handleReviewSubmit}>
              {/* Од дардаг хэсэг */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg 
                      className={`w-10 h-10 ${star <= reviewData.rating ? 'text-yellow-400' : 'text-gray-200'}`} 
                      fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Сэтгэгдэл бичих хэсэг */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Сэтгэгдэл (Заавал биш)</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Энд сэтгэгдлээ үлдээнэ үү..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                ></textarea>
              </div>

              {/* Товчнууд */}
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Болих
                </button>
                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 disabled:bg-gray-400"
                >
                  {submittingReview ? 'Илгээж байна...' : 'Илгээх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;