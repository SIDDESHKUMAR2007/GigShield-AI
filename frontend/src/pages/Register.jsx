import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', 
    city: 'Bengaluru', deliveryZone: 'Koramangala', 
    platformType: 'Zomato', avgWeeklyEarnings: 5000, 
    workingHoursPerDay: 8, role: 'worker'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      alert('Signup Failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="glass-panel w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-2 text-center text-accent">GigShield Onboarding</h2>
        <p className="text-center text-textMuted mb-6">Complete your profile to generate risk coverage</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h3 className="font-bold border-b border-white/10 pb-2">Basic Info</h3>
            <div className="flex gap-2">
                <input type="text" placeholder="Full Name" className="w-1/2 bg-primary border px-3 py-2 border-white/10 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                <input type="text" placeholder="Phone" className="w-1/2 bg-primary border px-3 py-2 border-white/10 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required/>
            </div>
            <input type="password" placeholder="Password" className="w-full bg-primary border px-3 py-2 border-white/10 rounded" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required/>
            
            <h3 className="font-bold border-b border-white/10 pb-2 mt-2">Work Details</h3>
            <div className="flex gap-2">
                <input type="text" placeholder="City" className="w-1/2 bg-primary border px-3 py-2 border-white/10 rounded" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required/>
                <select className="w-1/2 bg-primary border border-white/10 rounded px-3 py-2" value={formData.deliveryZone} onChange={e => setFormData({...formData, deliveryZone: e.target.value})}>
                <option>Koramangala</option><option>Indiranagar</option><option>Delhi NCR</option>
                </select>
            </div>
             <div className="flex gap-2">
                <select className="w-1/2 bg-primary border border-white/10 rounded px-3 py-2" value={formData.platformType} onChange={e => setFormData({...formData, platformType: e.target.value})}>
                    <option>Zomato</option><option>Swiggy</option>
                </select>
                <input type="number" placeholder="Working Hours" className="w-1/2 bg-primary border px-3 py-2 border-white/10 rounded" value={formData.workingHoursPerDay} onChange={e => setFormData({...formData, workingHoursPerDay: e.target.value})} required/>
            </div>
            <input type="number" placeholder="Weekly Earnings (₹)" className="w-full bg-primary border px-3 py-2 border-white/10 rounded" value={formData.avgWeeklyEarnings} onChange={e => setFormData({...formData, avgWeeklyEarnings: e.target.value})} required/>
            
            <button type="submit" className="w-full btn-primary mt-4">Generate Risk Score & Coverage</button>
        </form>
      </div>
    </div>
  );
}
