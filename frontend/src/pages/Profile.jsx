import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    profession: '',
    bio: '',
    skills: '',
    experience: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Ой санамжид байгаа мэдээллийг форм руу хийх
      setFormData({
        profession: user.profession || '',
        bio: user.bio || '',
        skills: user.skills || '',
        experience: user.experience || ''
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/profile/${user._id}`, formData);
      
      // AuthContext дахь ой санамжийг шинэчилж байна (хуучин token-оо хадгалж үлдэнэ)
      const updatedUser = { ...user, ...res.data };
      login(updatedUser); 
      
      alert("Таны CV (Профайл) амжилттай хадгалагдлаа!");
    } catch (error) {
      console.error(error);
      alert("Хадгалахад алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-gray-900">Миний CV & Профайл</h1>
          <Link to="/" className="text-blue-600 font-bold hover:underline">← Буцах</Link>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gray-100">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl font-black uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
              <p className="text-gray-500 font-medium">{user.email}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === 'worker' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {user.role === 'worker' ? 'Ажил хайгч' : 'Ажил олгогч'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Мэргэжил / Чиглэл</label>
              <input 
                type="text" 
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Жнь: График дизайнер, Вэб хөгжүүлэгч..." 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Товч танилцуулга (Bio)</label>
              <textarea 
                name="bio"
                rows="3"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Өөрийнхөө тухай товчхон..." 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Ур чадварууд</label>
              <input 
                type="text" 
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Жнь: Photoshop, React, Англи хэл (Таслалаар тусгаарлана уу)" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Ажлын туршлага</label>
              <textarea 
                name="experience"
                rows="4"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Өмнө нь хаана, ямар ажил хийж байсан бэ?" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-70"
            >
              {isSaving ? 'Хадгалж байна...' : 'Мэдээллээ хадгалах'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;