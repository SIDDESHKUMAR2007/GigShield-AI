import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function AppLayout() {
  const { user, logout } = useContext(AuthContext);
  return (
      <div className="min-h-screen flex flex-col items-center w-full">
        <nav className="w-full max-w-7xl mx-auto flex justify-between items-center p-6 border-b border-white/5">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <span className="text-accent">Gig</span>Shield
          </Link>
          <div className="flex gap-6 items-center text-sm font-medium">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            
            {!user ? (
               <>
                 <Link to="/login" className="hover:text-textLight text-textMuted transition-colors">Login</Link>
                 <Link to="/register" className="btn-primary text-xs py-1.5 px-3">Start Coverage</Link>
               </>
            ) : (
               <>
                 <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="hover:text-accent transition-colors">Portal</Link>
                 <button onClick={logout} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 text-xs text-red-300">Logout</button>
               </>
            )}
          </div>
        </nav>
        
        <main className="w-full max-w-7xl mx-auto p-6 flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
