import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resp = await login(phone, password);
      if(resp.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (error) {
      alert('Login Failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="glass-panel w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-textMuted mb-1">Phone Number</label>
            <input type="text" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2 text-white" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-textMuted mb-1">Password</label>
            <input type="password" className="w-full bg-primary border border-white/10 rounded-lg px-4 py-2 text-white" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary mt-4 py-3">Login to Dashboard</button>
        </form>
        <div className="text-center mt-6 text-textMuted">
          Don't have coverage? <Link to="/signup" className="text-accent hover:underline">Get insured</Link>
        </div>
      </div>
    </div>
  );
}
