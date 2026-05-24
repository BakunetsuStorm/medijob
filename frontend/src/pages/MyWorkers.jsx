import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; // 🔥 ШИНЭ: SweetAlert2 импортлох

const MyWorkers = () => {
  const { user } = useContext(AuthContext);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ revieweeId: null, jobId: null, rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => { fetchMyWorkers(); }, []);

  const fetchMyWorkers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/applications/employer', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const acceptedWorkers = response.data.filter(app => app.status === 'accepted');
      setWorkers(acceptedWorkers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ШИНЭЧЛЭГДСЭН: Ажил дуусгах хэсэг
  const handleCompleteJob = async (appId) => {
    const result = await Swal.fire({
      title: 'Ажил дууссан уу?',
      text: "Энэхүү ажлыг дууссан гэж тэмдэглэх үү? Ажилтны CV-д автоматаар нэмэгдэх болно.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Тийм, дуусгах',
      cancelButtonText: 'Болих'
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/api/applications/${appId}/status`, 
          { status: 'completed' },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        Swal.fire('Амжилттай!', 'Ажил амжилттай дууслаа!', 'success');
        fetchMyWorkers(); 
      } catch (error) {
        Swal.fire('Алдаа!', 'Алдаа гарлаа', 'error');
      }
    }
  };

  const openReviewModal = (revieweeId, jobId) => {
    setReviewData({ revieweeId, jobId, rating: 5, comment: '' });
    setIsModalOpen(true);
  };

  // 🔥 ШИНЭЧЛЭГДСЭН: Үнэлгээ өгөх хэсэг
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await axios.post('http://localhost:5000/api/reviews', reviewData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      Swal.fire('Амжилттай!', 'Үнэлгээ амжилттай хадгалагдлаа!', 'success');
      setIsModalOpen(false);
    } catch (error) {
      Swal.fire('Алдаа!', 'Үнэлгээ өгөхөд алдаа гарлаа.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 transition-colors">Миний ажилтнууд (Түүх)</h2>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 font-bold">Уншиж байна...</p>
        ) : workers.length === 0 ? (
          <div className="bg-white dark:bg-[#111111] p-10 rounded-2xl border border-gray-200 dark:border-gray-800 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Та одоогоор ямар нэгэн хүнийг ажилд аваагүй байна.</p>
            <Link to="/my-jobs" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Ирсэн анкетуудыг шалгах</Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 text-sm transition-colors">
                    <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-800">Ажилтны нэр</th>
                    <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-800">Хийсэн ажил</th>
                    <th className="p-4 font-bold border-b border-gray-200 dark:border-gray-800">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-none">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white transition-colors">{app.applicantId?.name || 'Нэр тодорхойгүй'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">{app.applicantId?.email}</div>
                        
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100/50 dark:border-blue-900/30 transition-colors">
                          <p className="text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Мэргэжил: <span className="font-medium text-gray-700 dark:text-gray-300">{app.applicantId?.profession || 'Оруулаагүй'}</span></p>
                          <p className="text-xs font-bold text-blue-800 dark:text-blue-400">Ур чадвар: <span className="font-medium text-gray-700 dark:text-gray-300">{app.applicantId?.skills || 'Оруулаагүй'}</span></p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300 font-medium align-top pt-5 transition-colors">
                        {app.jobId?.title || 'Устгагдсан ажил'}
                      </td>
                      <td className="p-4 align-top pt-5">
                        <div className="flex flex-col gap-2">
                          <button onClick={() => openReviewModal(app.applicantId?._id, app.jobId?._id)} className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-yellow-600 transition-colors text-center">
                             Дүгнэх
                          </button>
                          <button onClick={() => handleCompleteJob(app._id)} className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors text-center">
                             Дуусгах
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 max-w-md w-full shadow-2xl border dark:border-gray-800 transition-colors duration-300">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 transition-colors">Ажилтан дүгнэх</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6">Энэхүү ажилтан үүргээ хэр сайн гүйцэтгэсэн бэ?</p>
            
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
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Ажилтны талаарх сэтгэгдэл</label>
                <textarea rows="3" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-colors" placeholder="Маш хариуцлагатай..." value={reviewData.comment} onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}></textarea>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors">Болих</button>
                <button type="submit" disabled={submittingReview} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:bg-gray-400 disabled:dark:bg-gray-600">
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