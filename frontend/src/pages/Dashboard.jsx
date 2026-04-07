import { ShieldCheck, CloudLightning, TrendingUp, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const mockChartData = [
  { name: 'Mon', risk: 20 },
  { name: 'Tue', risk: 45 },
  { name: 'Wed', risk: 80 },
  { name: 'Thu', risk: 30 },
  { name: 'Fri', risk: 10 },
  { name: 'Sat', risk: 60 },
  { name: 'Sun', risk: 25 },
];

export default function Dashboard() {
  const { user, api } = useContext(AuthContext);
  const [policy, setPolicy] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!user) return;
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [policyRes, claimsRes] = await Promise.all([
          api.get('/policy/me', { headers }).catch(() => ({ data: null })),
          api.get('/claims/me', { headers }).catch(() => ({ data: [] }))
        ]);
        
        setPolicy(policyRes.data);
        setClaims(claimsRes.data);
      } catch (e) {
        console.error("Dashboard Fetch Error", e);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, api]);

  const activateCoverage = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await api.post('/policy/activate', {}, { headers: { Authorization: `Bearer ${token}` }});
        setPolicy(res.data.policy);
        alert('Coverage Activated Successfully');
    } catch(e) {
        alert("Failed to activate: " + e.response?.data?.error);
    }
  }

  if(!user) return <div className="text-center mt-20">Please <Link to="/login" className="text-accent underline">login</Link></div>;
  if(loading) return <div className="text-center mt-20">Loading portal...</div>;

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="glass-panel flex justify-between items-center bg-gradient-to-r from-card to-card/50">
        <div>
          <h2 className="text-3xl font-bold mb-1">Hello, {user.name} 🛵</h2>
          <p className="text-textMuted flex items-center gap-2">Zone: {user.zone}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-textMuted mb-1">Status</div>
          {policy ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-sm font-semibold">
              <ShieldCheck size={16} /> Active Coverage
            </div>
          ) : (
            <button onClick={activateCoverage} className="btn-primary text-sm shadow-xl">
                Activate Weekly Plan
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Risk Score" value={policy ? `${policy.riskScore}/100` : "--"} icon={<AlertTriangle className="text-orange-400"/>} />
        <MetricCard title="Weekly Premium" value={policy ? `₹${policy.weeklyPremium}` : "--"} icon={<ShieldCheck className="text-accent"/>} />
        <MetricCard title="Coverage Status" value={policy ? "Active" : "Inactive"} icon={<ShieldCheck className="text-blue-400"/>} />
        <MetricCard title="Earnings Protected" value={policy ? `₹${policy.coverageAmount}` : "--"} icon={<TrendingUp className="text-emerald-400"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel lg:col-span-2">
          <h3 className="text-xl font-bold mb-6">Zone Risk Forecast</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F34C3F" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F34C3F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a1a1aa" className="text-xs" />
                <YAxis stroke="#a1a1aa" className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
                <Area type="monotone" dataKey="risk" stroke="#F34C3F" fillOpacity={1} fill="url(#riskColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel flex flex-col">
          <h3 className="text-xl font-bold mb-6">Recent Claims</h3>
          <div className="flex flex-col gap-4 flex-1">
            {claims.length === 0 ? <div className="text-textMuted text-sm">No recent claims.</div> :
              claims.slice(0,4).map(claim => (
                <div key={claim._id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-white/5">
                    <div>
                        <div className="text-sm font-bold capitalize">{claim.triggerType} Disruption</div>
                        <div className="text-xs text-textMuted">{new Date(claim.timestamp).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold opacity-80">₹{claim.payoutAmount}</div>
                        <div className="text-xs text-green-400 font-semibold">{claim.status}</div>
                    </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }) {
  return (
    <div className={`glass-panel flex flex-col justify-center relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-textMuted text-sm font-medium">{title}</h4>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
