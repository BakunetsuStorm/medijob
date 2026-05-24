import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Үнэлгээний State
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Компанийн профайл модал харуулах State
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [loadingEmployer, setLoadingEmployer] = useState(false);

  useEffect(() => {
    fetchJobAndReviews();
  }, [id]);

  const fetchJobAndReviews = async () => {
    try {
      // 1. Ажлын мэдээллийг татах
      const jobRes = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      setJob(jobRes.data);

      // 2. Тухайн ажил олгогчид ирсэн үнэлгээнүүдийг татах
      const reviewRes = await axios.get(`http://localhost:5000/api/reviews/${jobRes.data.employerId}`);
      setReviews(reviewRes.data.reviews);
      setAverageRating(reviewRes.data.averageRating);
      setTotalReviews(reviewRes.data.totalReviews);

    } catch (error) {
      console.error("Мэдээлэл татахад алдаа гарлаа:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ажил олгогчийн профайлыг татаж модал дээр харуулах функц
  const handleViewEmployerProfile = async () => {
    setLoadingEmployer(true);
    try {
      // Хэрэглэгчдийн жагсаалтаас тухайн ажил олгогчийн ID-аар олж авах
      const res = await axios.get('http://localhost:5000/api/auth/users');
      const employerData = res.data.find(u => u._id === job.employerId);
      
      if (employerData) {
        setSelectedEmployer(employerData);
      } else {
        alert("Компанийн дэлгэрэнгүй мэдээлэл олдсонгүй.");
      }
    } catch (error) {
      console.error("Профайл татахад алдаа:", error);
      alert("Мэдээлэл татахад алдаа гарлаа.");
    } finally {
      setLoadingEmployer(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      Swal.fire({
        title: 'Нэвтрэх шаардлагатай!',
        text: 'Та эхлээд нэвтэрсэн байх шаардлагатай.',
        icon: 'warning',
        confirmButtonText: 'Ойлголоо',
        confirmButtonColor: '#3b82f6' // Цэнхэр өнгө
      });
      navigate('/login');
      return;
    }
    
    if (user.role === 'employer') {
      Swal.fire({
        title: 'Уучлаарай',
        text: 'Ажил олгогч ажилд орох хүсэлт илгээх боломжгүй.',
        icon: 'error',
        confirmButtonText: 'Хаах',
        confirmButtonColor: '#ef4444' // Улаан өнгө
      });
      return;
    }
    
    try {
      const applicationData = {
        jobId: id,
        employerId: job.employerId,
        jobTitle: job.title,
        employerName: job.employerName,
        applicantName: user.name,
        applicantEmail: user.email,
        coverLetter: "Профайлаар хүсэлт илгээв" 
      };

      await axios.post('http://localhost:5000/api/applications', applicationData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      // 🔥 АМЖИЛТТАЙ БОЛСОН ГОЁ POP-UP
      Swal.fire({
        title: 'Амжилттай!',
        text: 'Ажилд орох хүсэлт амжилттай илгээгдлээ!',
        icon: 'success',
        confirmButtonText: 'Гайхалтай',
        confirmButtonColor: '#10b981' // Ногоон өнгө
      }).then(() => {
        navigate('/my-applications');
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Алдаа гарлаа',
        text: error.response?.data?.message || "Хүсэлт илгээхэд алдаа гарлаа.",
        icon: 'error',
        confirmButtonText: 'Хаах',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  if (loading) return <div className="flex justify-center py-20 font-bold dark:bg-[#0a0a0a] min-h-screen dark:text-white transition-colors duration-300">Уншиж байна...</div>;
  if (!job) return <div className="text-center py-20 font-bold dark:bg-[#0a0a0a] min-h-screen dark:text-white transition-colors duration-300">Ажлын зар олдсонгүй.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Буцах товч */}
        <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white font-bold text-sm mb-6 inline-flex items-center gap-2 transition-colors">
          ← Буцах
        </Link>

        {/* Ажлын үндсэн мэдээлэл */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 mb-8 transition-colors duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 transition-colors">{job.title}</h1>
              
              {/* 🔥 Түр зуурын болон Давтамжтай ажлын Badge-ууд */}
              <div className="flex flex-wrap gap-3 mb-6">
                {job.isTemporary && (
                  <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3.5 py-1.5 rounded-lg text-sm font-bold border border-orange-200/50 dark:border-orange-800/50">
                    <span className="text-sm">⏱️</span> 
                    <span>{job.durationText}</span>
                  </div>
                )}
                {job.isRecurring && job.recurringDays && job.recurringDays.length > 0 && (
                  <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 px-3.5 py-1.5 rounded-lg text-sm font-bold border border-teal-200/50 dark:border-teal-800/50">
                    <span className="text-sm">🔄</span> 
                    <span>Гараг бүрийн: {job.recurringDays.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                
                {/* Байгууллагын нэрэн дээр дарахад профайл харагдана */}
                <button 
                  onClick={handleViewEmployerProfile} 
                  disabled={loadingEmployer}
                  className="font-bold text-lg text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  title="Байгууллагын профайл харах"
                >
                   {loadingEmployer ? 'Уншиж байна...' : job.employerName}
                </button>
                
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/50 transition-colors">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="text-yellow-700 dark:text-yellow-500 font-black text-sm">{averageRating}</span>
                  <span className="text-yellow-600/60 dark:text-yellow-500/60 text-xs font-bold">({totalReviews})</span>
                </div>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <div className="text-2xl font-black text-gray-900 dark:text-white transition-colors">{Number(job.salary).toLocaleString()}₮</div>
              <div className="text-gray-400 dark:text-gray-500 font-bold text-sm transition-colors">/ {job.salaryType}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-t border-gray-50 dark:border-gray-800 pt-6 transition-colors">
            <div>
              <div className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase mb-1">Төрөл</div>
              <div className="font-bold text-gray-900 dark:text-gray-300">{job.category}</div>
            </div>
            <div>
              <div className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase mb-1">Ажиллах хэлбэр</div>
              <div className="font-bold text-gray-900 dark:text-gray-300">{job.locationType}</div>
            </div>
            <div>
              <div className="text-gray-400 dark:text-gray-500 text-xs font-bold uppercase mb-1">Огноо</div>
              <div className="font-bold text-gray-900 dark:text-gray-300">{new Date(job.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {job.locationType !== 'Зайнаас' && job.location && (
            <div className="mb-10 bg-indigo-50/40 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-4 transition-colors">
              <div className="text-2xl mt-1"></div>
              <div>
                <div className="text-indigo-900/60 dark:text-indigo-400/60 text-[11px] font-black uppercase tracking-widest mb-1.5 transition-colors">Байршил / Дэлгэрэнгүй хаяг</div>
                <div className="font-bold text-indigo-900 dark:text-indigo-300 text-sm leading-relaxed transition-colors">{job.location}</div>
              </div>
            </div>
          )}

          <div className="mb-10 mt-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Ажлын тайлбар & Шаардлага</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line font-medium transition-colors">
              {job.requirements}
            </p>
          </div>

          {user?.role !== 'employer' && (
            <button 
              onClick={handleApply}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 dark:shadow-none"
            >
              Ажилд орох хүсэлт илгээх
            </button>
          )}
        </div>

        {/* --- ҮНЭЛГЭЭ БОЛОН СЭТГЭГДЛИЙН ХЭСЭГ --- */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 transition-colors">
            Сэтгэгдэлүүд 
            <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-500 dark:text-gray-400 font-bold transition-colors">{totalReviews}</span>
          </h3>

          {reviews.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 font-medium italic text-center py-10 transition-colors">Энэ байгууллагад одоогоор үнэлгээ ирээгүй байна.</p>
          ) : (
            <div className="space-y-8">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-gray-50 dark:border-gray-800 last:border-none pb-8 last:pb-0 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-black transition-colors">
                        {rev.reviewerId?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white transition-colors">{rev.reviewerId?.name}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium pl-13 transition-colors">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

 
      </div>
      {/* Цагийн хуваарийн гоё баннер */}
{job.workingHours && (
  <div className="mb-6 flex items-center gap-4 bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 transition-colors">
    <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm text-2xl">
      🕒
    </div>
    <div>
      <div className="text-blue-800/60 dark:text-blue-400/60 text-[11px] font-black uppercase tracking-widest mb-1">Ажиллах цагийн хуваарь</div>
      <div className="font-black text-lg text-blue-900 dark:text-blue-300">{job.workingHours}</div>
    </div>
  </div>
)}

      {/* КОМПАНИЙН ПРОФАЙЛ ХАРАХ МОДАЛ */}
      {selectedEmployer && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-[#111111] rounded-3xl w-full max-w-4xl shadow-2xl my-8 relative overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300 border dark:border-gray-800">
            
            {/* Толгойн хэсэг */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 p-8 text-white relative shrink-0 transition-colors">
              <button onClick={() => setSelectedEmployer(null)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 overflow-hidden bg-white text-purple-600 dark:bg-[#1a1a1a] dark:text-purple-400 flex items-center justify-center text-4xl font-black shadow-xl">
                  {selectedEmployer.profilePicture ? (
                    <img src={selectedEmployer.profilePicture} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    selectedEmployer.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-black mb-1">{selectedEmployer.name}</h2>
                  <p className="text-purple-100 dark:text-purple-200 font-medium mb-3">{selectedEmployer.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{selectedEmployer.companyIndustry || 'Салбар тодорхойгүй'}</span>
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
                    <div className="text-4xl font-black text-yellow-400 mb-1">⭐ {averageRating}</div>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{totalReviews} хүний үнэлгээ</p>
                  </div>

                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Холбоо барих</h3>
                    <div className="space-y-3">
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Вэбсайт:</p><p className="font-bold text-blue-600 dark:text-blue-400 break-words">{selectedEmployer.website ? <a href={`https://${selectedEmployer.website.replace('https://', '')}`} target="_blank" rel="noreferrer" className="hover:underline">{selectedEmployer.website}</a> : '-'}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Регистр:</p><p className="font-bold text-gray-900 dark:text-white">{selectedEmployer.companyRegNumber || '-'}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400">Утас:</p><p className="font-bold text-gray-900 dark:text-white">{selectedEmployer.phone || 'Нууцлагдсан'}</p></div>
                    </div>
                  </div>
                </div>

                {/* Баруун багана */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">Байгууллагын танилцуулга</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedEmployer.bio || 'Танилцуулга оруулаагүй байна.'}</p>
                  </div>

                  <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Ажилчдын сэтгэгдэл</h3>
                    {reviews.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-[#111111] p-4 rounded-xl">Одоогоор сэтгэгдэл алга байна.</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map(rev => (
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

export default JobDetails;