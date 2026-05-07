import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    profilePicture: user?.profilePicture || '',
    website: user?.website || '',
    phone: user?.phone || '', 
    age: user?.age || '',
    gender: user?.gender || '',
    professions: user?.professions || [], 
    bio: user?.bio || '',
    skills: user?.skills || '',
    experience: Array.isArray(user?.experience) ? user.experience : [],
    companyRegNumber: user?.companyRegNumber || '', 
    companyIndustry: user?.companyIndustry || ''    
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExperience, setNewExperience] = useState({ title: '', company: '', duration: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const availableProfessions = [
  'Зөөгч, Бариста', 'Касс, Худалдагч', 'Угтах үйлчилгээ (Ресепшн)', 
  'Бараа өрөгч, Агуулах', 'Тогооч, Тогоочийн туслах', 'Цэвэрлэгээ, Үйлчилгээ',
  'Түгээлт, Хүргэлт', 'Ачигч, Хар ажил', 'Жолооч',
  'Мэдээлэл оруулагч (Data Entry)', 'Хэрэглэгчийн төв (Call Center)', 'Орчуулга',
  'Промоутер, Борлуулалт', 'Сошиал медиа хөгжүүлэлт', 'Маркетинг, Олон нийттэй харилцах',
  'Вэб болон Апп хөгжүүлэлт', 'График дизайн', 'Видео эвлүүлэг, Зураг авалт', 'Мэдээллийн технологи (IT)',
  'Гэрийн багш, Сургалт', 'Эвэнт, Арга хэмжээний туслах', 'Бусад'
  ];

  const industries = [
    'Мэдээллийн технологи, Харилцаа холбоо',
    'Худалдаа, Үйлчилгээ',
    'Барилга, Үл хөдлөх хөрөнгө',
    'Боловсрол, Сургалт',
    'Эрүүл мэнд, Эмнэлэг',
    'Уул уурхай, Хүнд үйлдвэр',
    'Банк, Санхүү',
    'Бусад'
  ];

  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reviews/${user._id}`);
        setMyReviews(res.data.reviews);
        setAverageRating(res.data.averageRating);
      } catch (error) {
        console.error("Үнэлгээ татахад алдаа", error);
      }
    };
    if(user) fetchMyReviews();
  }, [user]);

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const toggleProfession = (prof) => {
    setProfileData((prev) => {
      const isSelected = prev.professions.includes(prof);
      if (isSelected) {
        return { ...prev, professions: prev.professions.filter((p) => p !== prof) };
      } else {
        return { ...prev, professions: [...prev.professions, prof] };
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        alert("Зурагны хэмжээ 2MB-аас бага байх ёстой.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePicture: reader.result });
      };
    }
  };

  const handleExperienceChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  const addExperienceToList = () => {
    if (!newExperience.title || !newExperience.company) {
      alert("Албан тушаал болон Компанийн нэрийг заавал оруулна уу.");
      return;
    }
    setProfileData({
      ...profileData,
      experience: [...(Array.isArray(profileData.experience) ? profileData.experience : []), newExperience]
    });
    setNewExperience({ title: '', company: '', duration: '', description: '' });
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setProfileData({
      profilePicture: user?.profilePicture || '',
      website: user?.website || '',
      phone: user?.phone || '', 
      age: user?.age || '',
      gender: user?.gender || '',
      professions: user?.professions || [], 
      bio: user?.bio || '',
      skills: user?.skills || '',
      experience: Array.isArray(user?.experience) ? user.experience : [],
      companyRegNumber: user?.companyRegNumber || '', 
      companyIndustry: user?.companyIndustry || ''
    });
    setIsEditing(false); 
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/profile/${user._id}`, profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedUser = { ...user, ...res.data };
      login(updatedUser); 
      alert('Профайл амжилттай шинэчлэгдлээ!');
      setIsEditing(false); 
    } catch (error) {
      console.error(error);
      alert('Хадгалахад алдаа гарлаа.');
    } finally {
      setSaving(false);
    }
  };

  const isEmployer = user?.role === 'employer';

  return (
    // 🔥 ШИНЭЧЛЭЛТ: dark:bg-[#0a0a0a] нэмэгдсэн
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ХЭРЭГЛЭГЧИЙН ЕРӨНХИЙ МЭДЭЭЛЭЛ */}
        {/* 🔥 ШИНЭЧЛЭЛТ: dark:bg-[#111111] dark:border-gray-800 */}
        <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden transition-colors duration-300">
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-bl-full -mr-10 -mt-10 z-0 pointer-events-none ${isEmployer ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'}`}></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className={`relative w-24 h-24 ${isEditing ? 'group cursor-pointer' : ''}`}>
              {isEditing && (
                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" title="Зураг солих" />
              )}
              {profileData.profilePicture ? (
                <img src={profileData.profilePicture} alt="Profile" className="w-24 h-24 rounded-2xl object-cover shadow-xl border-4 border-white dark:border-[#111111]" />
              ) : (
                <div className={`w-24 h-24 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl transform -rotate-3 ${isEmployer ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-indigo-600'}`}>
                  {user?.name?.charAt(0)}
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 pointer-events-none">
                  <span className="text-white text-xs font-bold text-center px-1">Зураг<br/>солих</span>
                </div>
              )}
            </div>

            <div>
              {/* 🔥 ШИНЭЧЛЭЛТ: dark:text-white */}
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1 transition-colors">{user?.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400 font-medium transition-colors">{user?.email}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isEmployer ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                  {isEmployer ? 'Ажил олгогч' : 'Ажил хайгч'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex gap-3 w-full md:w-auto">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="flex-1 md:flex-none px-6 py-3.5 rounded-xl font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Цуцлах</button>
                <button onClick={saveProfile} disabled={saving} className="flex-1 md:flex-none bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-xl font-bold hover:bg-black dark:hover:bg-gray-200 hover:shadow-lg transition-all disabled:bg-gray-400 disabled:dark:bg-gray-600">
                  {saving ? 'Хадгалж байна...' : ' Хадгалах'}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full md:w-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all shadow-sm">
                 Профайл засах
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Зүүн багана */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors">Холбоо барих & Мэдээлэл</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Утасны дугаар</label>
                  {isEditing ? (
                    // 🔥 ШИНЭЧЛЭЛТ: dark:bg-[#1a1a1a] dark:text-white dark:border-gray-700
                    <input type="text" name="phone" value={profileData.phone} onChange={handleInputChange} placeholder="Жнь: 99112233" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 dark:text-white outline-none transition-all" />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-bold text-lg transition-colors">{profileData.phone || <span className="text-gray-400 text-sm font-normal">Оруулаагүй байна</span>}</p>
                  )}
                </div>

                {isEmployer ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Байгууллагын Регистр <span className="text-xs normal-case">(Нэмэлт)</span></label>
                      {isEditing ? (
                        <input type="text" name="companyRegNumber" value={profileData.companyRegNumber} onChange={handleInputChange} placeholder="Жнь: 1234567" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-600 dark:text-white outline-none transition-all" />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-bold text-base transition-colors">{profileData.companyRegNumber || <span className="text-gray-400 text-sm font-normal">Оруулаагүй байна</span>}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Үйл ажиллагааны чиглэл <span className="text-xs normal-case">(Нэмэлт)</span></label>
                      {isEditing ? (
                        <select name="companyIndustry" value={profileData.companyIndustry} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-600 dark:text-white outline-none cursor-pointer transition-all">
                          <option value="">-- Сонгохгүй байж болно --</option>
                          {industries.map((ind, idx) => (
                            <option key={idx} value={ind}>{ind}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-bold text-base transition-colors">{profileData.companyIndustry || <span className="text-gray-400 text-sm font-normal">Оруулаагүй байна</span>}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Компанийн Вэбсайт</label>
                      {isEditing ? (
                        <input type="text" name="website" value={profileData.website} onChange={handleInputChange} placeholder="Жнь: www.tech.mn" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-purple-600 dark:text-white outline-none transition-all" />
                      ) : (
                        <p className="text-blue-600 dark:text-blue-400 font-bold text-base transition-colors">{profileData.website ? <a href={`https://${profileData.website.replace('https://', '')}`} target="_blank" rel="noreferrer" className="hover:underline">{profileData.website}</a> : <span className="text-gray-400 text-sm font-normal">Оруулаагүй байна</span>}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Нас</label>
                      {isEditing ? (
                        <input type="number" name="age" value={profileData.age} onChange={handleInputChange} placeholder="Жнь: 25" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 dark:text-white outline-none transition-all" />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-bold text-base transition-colors">{profileData.age ? `${profileData.age} настай` : <span className="text-gray-400 text-sm font-normal">Оруулаагүй байна</span>}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Хүйс</label>
                      {isEditing ? (
                        <select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 dark:text-white outline-none cursor-pointer transition-all">
                          <option value="" disabled>-- Сонгох --</option>
                          <option value="Эрэгтэй">Эрэгтэй</option>
                          <option value="Эмэгтэй">Эмэгтэй</option>
                          <option value="Бусад">Бусад</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 dark:text-white font-bold text-base transition-colors">{profileData.gender || <span className="text-gray-400 text-sm font-normal">Оруулаагүй байна</span>}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden text-white ${isEmployer ? 'bg-gradient-to-br from-indigo-900 to-purple-900' : 'bg-gradient-to-br from-gray-900 to-black'}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
              <h2 className="text-xl font-black mb-6 border-b border-white/10 pb-4 relative z-10">{isEmployer ? 'Компанийн үнэлгээ' : 'Миний үнэлгээ'}</h2>
              <div className="flex items-end gap-3 relative z-10">
                <div className="text-5xl font-black text-yellow-400">{averageRating || 0}</div>
                <div className="mb-1 text-white/60 font-medium">/ 5.0</div>
              </div>
              <p className="text-sm font-medium text-white/60 mt-2 relative z-10">Нийт {myReviews.length} үнэлгээ байна.</p>
            </div>
          </div>

          {/* Баруун багана */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors">
                {isEmployer ? 'Байгууллагын танилцуулга' : 'Мэргэжлийн мэдээлэл (CV)'}
              </h2>
              
              <div className="mb-6">
                {!isEmployer && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Миний чиглэл / Мэргэжил</label>
                      {isEditing ? (
                        <div className="flex flex-wrap gap-2">
                          {availableProfessions.map((prof, idx) => {
                            const isSelected = profileData.professions.includes(prof);
                            return (
                              <button key={idx} type="button" onClick={() => toggleProfession(prof)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white'}`}>
                                {isSelected ? '✓ ' : ''}{prof}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {profileData.professions.length > 0 ? (
                            profileData.professions.map((prof, idx) => (
                              <span key={idx} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-md text-sm font-bold border border-blue-100 dark:border-blue-900/50 transition-colors">{prof}</span>
                            ))
                          ) : (
                            <p className="text-gray-400 text-sm">Оруулаагүй байна</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Онцлох ур чадварууд</label>
                      {isEditing ? (
                        <input type="text" name="skills" value={profileData.skills} onChange={handleInputChange} placeholder="Жнь: React, Node.js, Photoshop..." className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-600 dark:text-white outline-none transition-all" />
                      ) : (
                        <p className="text-gray-900 dark:text-white font-medium text-base transition-colors">{profileData.skills || <span className="text-gray-400 text-sm font-normal">Оруулаагүй байна</span>}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Дэлгэрэнгүй танилцуулга</label>
                {isEditing ? (
                  <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows="5" placeholder={isEmployer ? "Компанийнхаа үйл ажиллагаа, онцлог давуу талыг бичнэ үү..." : "Өөрийнхөө давуу тал болон юу хийж чаддаг талаараа бичнэ үү..."} className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 dark:text-white outline-none resize-y transition-all ${isEmployer ? 'focus:ring-purple-600' : 'focus:ring-blue-600'}`}></textarea>
                ) : (
                  <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed bg-gray-50 dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 min-h-[120px] transition-colors">
                    {profileData.bio ? profileData.bio : <span className="text-gray-400 italic">Танилцуулга бичээгүй байна...</span>}
                  </div>
                )}
              </div>
            </div>

            {!isEmployer && (
              <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white transition-colors">Ажлын туршлага</h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 transition-colors">Өмнө нь хийж гүйцэтгэсэн ажлууд</p>
                  </div>
                  
                  {isEditing && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all flex items-center justify-center gap-2">
                      ➕ Туршлага нэмэх
                    </button>
                  )}
                </div>

                {!Array.isArray(profileData.experience) || profileData.experience.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
                    <div className="text-4xl mb-3"></div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 transition-colors">Туршлага хоосон байна</h3>
                    {isEditing ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Дээрх товчийг дарж туршлагаа нэмнэ үү.</p>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Профайл засах хэсгээр орон туршлагаа нэмэх боломжтой.</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-gray-700 before:to-transparent">
                    {profileData.experience.map((exp, index) => (
                      <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white dark:border-[#111111] bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xl transition-colors">💼</div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                          <h3 className="font-black text-gray-900 dark:text-white text-lg mb-1 transition-colors">{exp.title}</h3>
                          <div className="text-blue-600 dark:text-blue-400 font-bold text-sm mb-3 transition-colors">{exp.company} <span className="text-gray-400 dark:text-gray-500 font-medium ml-2">• {exp.duration}</span></div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-relaxed transition-colors">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-8 max-w-lg w-full shadow-2xl transition-colors duration-300 border dark:border-gray-800">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Туршлага нэмэх</h3>
            <div className="space-y-4 mb-8">
              <input type="text" name="title" value={newExperience.title} onChange={handleExperienceChange} placeholder="Албан тушаал (Жнь: Вэб хөгжүүлэгч)" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border dark:border-gray-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-blue-600" />
              <input type="text" name="company" value={newExperience.company} onChange={handleExperienceChange} placeholder="Компанийн нэр (Жнь: Tech ХХК)" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border dark:border-gray-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-blue-600" />
              <input type="text" name="duration" value={newExperience.duration} onChange={handleExperienceChange} placeholder="Ажилласан хугацаа (Жнь: 2021-2023)" className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border dark:border-gray-700 rounded-xl outline-none dark:text-white focus:ring-2 focus:ring-blue-600" />
              <textarea name="description" value={newExperience.description} onChange={handleExperienceChange} rows="3" placeholder="Хийсэн ажлын дэлгэрэнгүй..." className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border dark:border-gray-700 rounded-xl outline-none resize-none dark:text-white focus:ring-2 focus:ring-blue-600"></textarea>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 font-bold rounded-xl text-gray-700 dark:text-gray-300 transition-colors">Болих</button>
              <button onClick={addExperienceToList} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-white transition-colors">Нэмэх</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;