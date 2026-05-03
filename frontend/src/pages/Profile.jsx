import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState({
    age: user?.age || '',
    gender: user?.gender || '',
    profession: user?.profession || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
    experience: Array.isArray(user?.experience) ? user.experience : []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExperience, setNewExperience] = useState({
    title: '', company: '', duration: '', description: ''
  });

  const [saving, setSaving] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

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

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/profile/${user._id}`, profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Ой санамж дахь хуучин мэдээллийг шинэчлэх
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('CV / Профайл амжилттай шинэчлэгдлээ!');
    } catch (error) {
      console.error(error);
      alert('Профайл хадгалахад алдаа гарлаа.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ТОЛГОЙ ХЭСЭГ (HEADER) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-bl-full -mr-10 -mt-10 z-0 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl shadow-blue-600/30 transform -rotate-3">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-1">{user?.name}</h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium">{user?.email}</span>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={saveProfile} 
            disabled={saving}
            className="w-full md:w-auto relative z-10 bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-black hover:shadow-xl transition-all hover:-translate-y-1 disabled:bg-gray-400 disabled:transform-none"
          >
            {saving ? 'Хадгалж байна...' : '💾 Өөрчлөлтийг хадгалах'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ЗҮҮН БАГАНА: ХУВИЙН МЭДЭЭЛЭЛ & СТАТИСТИК */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Хувийн мэдээлэл</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Нас</label>
                  <input type="number" name="age" value={profileData.age} onChange={handleInputChange} placeholder="Жнь: 25" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Хүйс</label>
                  <div className="relative">
                    <select name="gender" value={profileData.gender} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer">
                      <option value="" disabled>-- Сонгох --</option>
                      <option value="Эрэгтэй">Эрэгтэй</option>
                      <option value="Эмэгтэй">Эмэгтэй</option>
                      <option value="Бусад">Бусад</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Үнэлгээний Картыг хажуу талд нь оруулж ирсэн нь */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
              <h2 className="text-xl font-black mb-6 border-b border-gray-800 pb-4 relative z-10">Миний үнэлгээ</h2>
              <div className="flex items-end gap-3 relative z-10">
                <div className="text-5xl font-black text-yellow-400">{averageRating || 0}</div>
                <div className="mb-1 text-gray-400 font-medium">/ 5.0</div>
              </div>
              <p className="text-sm font-medium text-gray-400 mt-2 relative z-10">Нийт {myReviews.length} хүн дүгнэсэн байна.</p>
            </div>
          </div>

          {/* БАРУУН БАГАНА: МЭРГЭЖЛИЙН CV & ТУРШЛАГА */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-100 pb-4">Мэргэжлийн мэдээлэл (CV)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Миний мэргэжил</label>
                  <input type="text" name="profession" value={profileData.profession} onChange={handleInputChange} placeholder="Жнь: Ахлах график дизайнер" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Онцлох ур чадварууд</label>
                  <input type="text" name="skills" value={profileData.skills} onChange={handleInputChange} placeholder="Жнь: React, Node.js, Photoshop..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Товч танилцуулга (Bio)</label>
                <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows="4" placeholder="Өөрийнхөө давуу тал болон юу хийж чаддаг талаараа бичнэ үү..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-y"></textarea>
              </div>
            </div>

            {/* АЖЛЫН ТУРШЛАГЫН ХЭСЭГ */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-xl font-black text-gray-900">Ажлын туршлага</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Өмнө нь хийж гүйцэтгэсэн ажлууд</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                >
                  ➕ Туршлага нэмэх
                </button>
              </div>

              {!Array.isArray(profileData.experience) || profileData.experience.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Туршлага хоосон байна</h3>
                  <p className="text-gray-500 text-sm font-medium">Дээрх товчийг дарж туршлагаа нэмнэ үү.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                  {profileData.experience.map((exp, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Timeline цэг */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xl">
                        💼
                      </div>
                      
                      {/* Картын агуулга */}
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-black text-gray-900 text-lg">{exp.title}</h3>
                        </div>
                        <div className="text-blue-600 font-bold text-sm mb-3">{exp.company} <span className="text-gray-400 font-medium ml-2">• {exp.duration}</span></div>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- ТУРШЛАГА НЭМЭХ МОДАЛ ЦОНХ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform transition-transform">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Туршлага нэмэх</h3>
            <p className="text-gray-500 text-sm font-medium mb-6">CV дээрээ өөрийнхөө хийсэн ажлуудыг харуулах</p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Албан тушаал</label>
                <input type="text" name="title" value={newExperience.title} onChange={handleExperienceChange} placeholder="Жнь: Вэб хөгжүүлэгч" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Компани эсвэл Төслийн нэр</label>
                <input type="text" name="company" value={newExperience.company} onChange={handleExperienceChange} placeholder="Жнь: Tech ХХК" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Ажилласан хугацаа</label>
                <input type="text" name="duration" value={newExperience.duration} onChange={handleExperienceChange} placeholder="Жнь: 2021 он - 2023 он" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Хийсэн ажлын дэлгэрэнгүй</label>
                <textarea name="description" value={newExperience.description} onChange={handleExperienceChange} rows="3" placeholder="Ямар төслүүд дээр хэрхэн ажилласан бэ..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none"></textarea>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Болих</button>
              <button onClick={addExperienceToList} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20">Нэмэх</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;