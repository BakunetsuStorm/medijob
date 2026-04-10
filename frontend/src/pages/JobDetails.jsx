import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Ой санамжийг дуудах

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Хэн нэвтэрснийг шалгах
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Хүсэлт илгээх төлөвүүд
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(response.data);
      } catch (error) {
        console.error('Ажлын мэдээлэл татахад алдаа гарлаа:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Та эхлээд нэвтэрч орно уу!");
      return navigate('/login');
    }
    if (user.role !== 'worker') {
      return alert("Зөвхөн Ажил хайгч хүсэлт илгээх боломжтой!");
    }
    
    try {
      const applicationData = {
        jobId: job._id,
        jobTitle: job.title,
        applicantId: user._id,
        applicantName: user.name,
        applicantEmail: user.email,
        employerName: job.employerName,
        coverLetter: coverLetter
      };

      await axios.post('http://localhost:5000/api/applications', applicationData);
      alert("Таны хүсэлт амжилттай илгээгдлээ! Ажил олгогч тантай холбогдох болно.");
      setIsApplying(false); // Хайрцгийг хаах
    } catch (error) {
      console.error(error);
      alert("Хүсэлт илгээхэд алдаа гарлаа.");
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-[3px] border-gray-200 border-t-blue-600"></div></div>;
  if (!job) return <div className="text-center mt-20">Ажлын зар олдсонгүй</div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="bg-white border-b border-gray-200 pt-10 pb-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors mb-8">← Буцах</button>
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wide mb-4">{job.category}</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">{job.title}</h1>
          <p className="text-gray-500 font-medium font-bold">{job.employerName}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="w-full lg:w-2/3 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ажлын тухай & Шаардлага</h3>
              <div className="text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                {job.requirements || "Дэлгэрэнгүй мэдээлэл одоогоор алга байна."}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 sticky top-28">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">Цалин</p>
              <div className="flex items-baseline gap-2 text-gray-900 mb-8">
                <span className="text-4xl font-black text-blue-600">{job.salary.toLocaleString()}₮</span>
                <span className="text-lg font-bold text-gray-400">/ {job.salaryType}</span>
              </div>

              {!isApplying ? (
                <button 
                  onClick={() => setIsApplying(true)}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-blue-700 hover:-translate-y-0.5 transition-all mb-4"
                >
                  Ажилд орох хүсэлт илгээх
                </button>
              ) : (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-fade-in">
                  <label className="block text-sm font-bold text-blue-900 mb-2">Товч танилцуулга / Сэтгэгдэл:</label>
                  <textarea 
                    rows="4" 
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Сайн байна уу, би энэ ажлыг..."
                    className="w-full p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-600 mb-4 text-sm"
                  ></textarea>
                  <div className="flex gap-2">
                    <button onClick={handleApply} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">Илгээх</button>
                    <button onClick={() => setIsApplying(false)} className="flex-1 bg-white text-gray-600 font-bold py-2 rounded-lg border border-gray-200 hover:bg-gray-50">Цуцлах</button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;