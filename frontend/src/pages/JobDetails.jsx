import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

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

  const handleApply = async () => {
    if (!user) {
      alert("Та эхлээд нэвтэрсэн байх шаардлагатай.");
      navigate('/login');
      return;
    }
    
    if (user.role === 'employer') {
      alert("Ажил олгогч ажилд орох хүсэлт илгээх боломжгүй.");
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
      
      alert("Ажилд орох хүсэлт амжилттай илгээгдлээ!");
      navigate('/my-applications');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Хүсэлт илгээхэд алдаа гарлаа.");
    }
  };

  if (loading) return <div className="flex justify-center py-20 font-bold">Уншиж байна...</div>;
  if (!job) return <div className="text-center py-20 font-bold">Ажлын зар олдсонгүй.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Буцах товч */}
        <Link to="/" className="text-gray-500 hover:text-black font-bold text-sm mb-6 inline-flex items-center gap-2">
          ← Буцах
        </Link>

        {/* Ажлын үндсэн мэдээлэл */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-lg text-blue-600">{job.employerName}</span>
                
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="text-yellow-700 font-black text-sm">{averageRating}</span>
                  <span className="text-yellow-600/60 text-xs font-bold">({totalReviews})</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-black text-gray-900">{Number(job.salary).toLocaleString()}₮</div>
              <div className="text-gray-400 font-bold text-sm">/ {job.salaryType}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-t border-gray-50 pt-6">
            <div>
              <div className="text-gray-400 text-xs font-bold uppercase mb-1">Төрөл</div>
              <div className="font-bold text-gray-900">{job.category}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs font-bold uppercase mb-1">Ажиллах хэлбэр</div>
              <div className="font-bold text-gray-900">{job.locationType}</div>
            </div>
            <div>
              <div className="text-gray-400 text-xs font-bold uppercase mb-1">Огноо</div>
              <div className="font-bold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {/* 🔥 ШИНЭЭР НЭМЭГДСЭН: Нарийвчилсан хаяг харуулах хэсэг */}
          {job.locationType !== 'Зайнаас' && job.location && (
            <div className="mb-10 bg-indigo-50/40 p-5 rounded-2xl border border-indigo-100 flex items-start gap-4">
              <div className="text-2xl mt-1"></div>
              <div>
                <div className="text-indigo-900/60 text-[11px] font-black uppercase tracking-widest mb-1.5">Байршил / Дэлгэрэнгүй хаяг</div>
                <div className="font-bold text-indigo-900 text-sm leading-relaxed">{job.location}</div>
              </div>
            </div>
          )}

          <div className="mb-10 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ажлын тайлбар & Шаардлага</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line font-medium">
              {job.requirements}
            </p>
          </div>

          {user?.role !== 'employer' && (
            <button 
              onClick={handleApply}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
            >
              Ажилд орох хүсэлт илгээх
            </button>
          )}
        </div>

        {/* --- ҮНЭЛГЭЭ БОЛОН СЭТГЭГДЛИЙН ХЭСЭГ --- */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            Сэтгэгдэлүүд 
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-500 font-bold">{totalReviews}</span>
          </h3>

          {reviews.length === 0 ? (
            <p className="text-gray-400 font-medium italic text-center py-10">Энэ байгууллагад одоогоор үнэлгээ ирээгүй байна.</p>
          ) : (
            <div className="space-y-8">
              {reviews.map((rev) => (
                <div key={rev._id} className="border-b border-gray-50 last:border-none pb-8 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black">
                        {rev.reviewerId?.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{rev.reviewerId?.name}</div>
                        <div className="text-xs text-gray-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium pl-13">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobDetails;