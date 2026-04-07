import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
        
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="flex flex-col gap-4">
          
          {step === 1 && (
             <div className="animate-in slide-in-from-right duration-300">
               <h3 className="font-bold border-b border-white/10 pb-2 mb-4">Step 1: Basic Info</h3>
               <div className="flex flex-col gap-3">
                 <input type="text" placeholder="Full Name" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
                 <input type="text" placeholder="Phone Number" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required/>
                 <input type="password" placeholder="Password" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required/>
               </div>
               <button type="submit" className="w-full btn-primary mt-6">Next Step &rarr;</button>
             </div>
          )}

          {step === 2 && (
             <div className="animate-in slide-in-from-right duration-300">
               <h3 className="font-bold border-b border-white/10 pb-2 mb-4">Step 2: Work Details</h3>
               <div className="flex flex-col gap-3">
                 <select className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2" value={formData.platformType} onChange={e => setFormData({...formData, platformType: e.target.value})}>
                   <option>Zomato</option><option>Swiggy</option><option>Other</option>
                 </select>
                 <select className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2" value={formData.deliveryZone} onChange={e => setFormData({...formData, deliveryZone: e.target.value})}>
                   <option>Koramangala</option><option>Indiranagar</option><option>Kengeri</option><option>Delhi NCR</option>
                 </select>
                 <input type="number" placeholder="Average Weekly Earnings (₹)" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2" value={formData.avgWeeklyEarnings} onChange={e => setFormData({...formData, avgWeeklyEarnings: e.target.value})} required/>
                 <input type="number" placeholder="Average Working Hours / Day" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2" value={formData.workingHoursPerDay} onChange={e => setFormData({...formData, workingHoursPerDay: e.target.value})} required/>
               </div>
               <div className="flex gap-4 mt-6">
                 <button type="button" onClick={() => setStep(1)} className="w-1/3 px-4 py-2 bg-white/5 rounded-lg">Back</button>
                 <button type="submit" className="w-2/3 btn-primary text-center justify-center">Complete Setup</button>
               </div>
             </div>
          )}

        </form>
      </div>
    </div>
  );
}
