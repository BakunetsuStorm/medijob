import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MyWorkers = () => {
  const { user } = useContext(AuthContext);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Үнэлгээний цонхны State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    revieweeId: null, // Ажилтны ID
    jobId: null,      // Ажлын ID
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchMyWorkers();
  }, []);

  const fetchMyWorkers = async () => {
    try {
      // Ажил олгогчийн заруудад ирсэн бүх хүсэлтийг татах API
      const response = await axios.get('http://localhost:5000/api/applications/employer', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // ЗӨВХӨН "Тэнцсэн" (accepted) төлөвтэй өргөдлүүдийг шүүж авах
      const acceptedWorkers = response.data.filter(app => app.status === 'accepted');
      setWorkers(acceptedWorkers);
    } catch (error) {
      console.error("Ажилтнуудын мэдээлэл татахад алдаа гарлаа", error);
    } finally {
      setLoading(false);
    }
  };

  // ШИНЭЭР НЭМСЭН ФУНКЦ: Ажил дуусгах
  const handleCompleteJob = async (appId) => {
    if(window.confirm("Энэхүү ажлыг дууссан гэж тэмдэглэх үү? Ажилтны CV-д автоматаар нэмэгдэх болно.")) {
      try {
        await axios.put(`http://localhost:5000/api/applications/${appId}/status`, 
          { status: 'completed' },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert("✅ Ажил амжилттай дууслаа! Ажилтны CV-рүү туршлага болон нэмэгдлээ.");
        
        // Ажил нь дууссан хүмүүсийг жагсаалтаас алга болгож шинэчлэх
        fetchMyWorkers(); 
      } catch (error) {
        console.error(error);
        alert("Алдаа гарлаа");
      }
    }
  };

  // Үнэлгээ өгөх цонх нээх функц
  const openReviewModal = (revieweeId, jobId) => {
    setReviewData({ revieweeId, jobId, rating: 5, comment: '' });
    setIsModalOpen(true);
  };

  // Үнэлгээ хадгалах функц
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await axios.post('http://localhost:5000/api/reviews', reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('⭐️ Ажилтанд өгсөн үнэлгээ амжилттай хадгалагдлаа!');
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
        <h2 className="text-3xl font-black text-gray-900 mb-8">Миний ажилтнууд (Түүх)</h2>

        {loading ? (
          <p className="text-gray-500 font-bold">Уншиж байна...</p>
        ) : workers.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-gray-200 text-center">
            <p className="text-gray-500 mb-4 font-medium">Та одоогоор ямар нэгэн хүнийг ажилд аваагүй байна.</p>
            <Link to="/my-jobs" className="text-blue-600 font-bold hover:underline">Ирсэн анкетуудыг шалгах</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 text-sm">
                    <th className="p-4 font-bold border-b border-gray-200">Ажилтны нэр</th>
                    <th className="p-4 font-bold border-b border-gray-200">Хийсэн ажил</th>
                    <th className="p-4 font-bold border-b border-gray-200">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{app.applicantId?.name || 'Нэр тодорхойгүй'}</div>
                        <div className="text-xs text-gray-500 font-medium mb-2">{app.applicantId?.email}</div>
                        
                        {/* --- CV МЭДЭЭЛЭЛ ХАРАГДАХ ХЭСЭГ --- */}
                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                          <p className="text-xs font-bold text-blue-800 mb-1">Мэргэжил: <span className="font-medium text-gray-700">{app.applicantId?.profession || 'Оруулаагүй'}</span></p>
                          <p className="text-xs font-bold text-blue-800">Ур чадвар: <span className="font-medium text-gray-700">{app.applicantId?.skills || 'Оруулаагүй'}</span></p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 font-medium align-top pt-5">
                        {app.jobId?.title || 'Устгагдсан ажил'}
                      </td>
                      <td className="p-4 align-top pt-5">
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => openReviewModal(app.applicantId?._id, app.jobId?._id)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-600 transition-colors text-center"
                          >
                            ⭐️ Дүгнэх
                          </button>
                          
                          <button 
                            onClick={() => handleCompleteJob(app._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors text-center"
                          >
                            ✅ Дуусгах
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* --- ҮНЭЛГЭЭ ӨГӨХ МОДАЛ ЦОНХ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Ажилтан дүгнэх</h3>
            <p className="text-gray-500 text-sm font-medium mb-6">Энэхүү ажилтан үүргээ хэр сайн гүйцэтгэсэн бэ?</p>
            
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Ажилтны талаарх сэтгэгдэл</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Маш хариуцлагатай, цагтаа ажлаа хийсэн гэх мэт..."
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
                  {submittingReview ? 'Илгээж байна...' : 'Үнэлгээ өгөх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWorkers;