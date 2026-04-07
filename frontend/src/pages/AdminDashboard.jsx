import { Users, Activity, AlertCircle, MapPin, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const mockData = [
  { zone: 'Kengeri', claims: 45 },
  { zone: 'Indiranagar', claims: 120 },
  { zone: 'Koramangala', claims: 210 },
  { zone: 'Whitefield', claims: 90 },
  { zone: 'Delhi NCR', claims: 155 },
];

export default function AdminDashboard() {
  const { user, api } = useContext(AuthContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    if(!user || user.role !== 'admin') return;
    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get('/analytics/dashboard', { headers: { Authorization: `Bearer ${token}` }});
            setData(res.data);
        } catch(e) { console.error(e); }
    };
    fetchAnalytics();
  }, [user, api]);

  if(!user || user.role !== 'admin') {
      return <div className="text-center mt-20">Access Denied. <Link to="/login" className="text-accent underline">Login as admin</Link>.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Admin Portal</h2>
        <div className="px-4 py-2 bg-accent/20 text-accent rounded-lg font-bold border border-accent/20 flex flex-col">
          <span>AI Engine Prediction</span>
          <span className="text-xs font-normal">Disruption Prob: {data?.aiPrediction?.disruptionProbability || 0}%</span>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 shadow-2xl">
        <MetricCard title="Active Policies" value={data?.activePolicies || 0} icon={<Users className="text-blue-400"/>} />
        <MetricCard title="Expected Claims" value={data?.aiPrediction?.expectedClaimLoad || 0} icon={<Activity className="text-orange-400"/>} />
        <MetricCard title="Fraud Alerts" value={data?.fraudAlerts || 0} icon={<AlertCircle className="text-red-400"/>} isAlert />
        <MetricCard title="High Risk Zones" value={data?.aiPrediction?.highRiskZones?.length || 0} icon={<MapPin className="text-yellow-400"/>} />
        <MetricCard title="Claims Triggered" value={data?.claimsTriggered || 0} icon={<IndianRupee className="text-emerald-400"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Chart */}
        <div className="glass-panel">
          <h3 className="text-xl font-bold mb-6">Claim Distribution Forecast</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <XAxis dataKey="zone" stroke="#a1a1aa" className="text-xs" />
                <YAxis stroke="#a1a1aa" className="text-xs" />
                <Tooltip cursor={{fill: '#ffffff10'}} />
                <Bar dataKey="claims" fill="#F34C3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Triggers feed */}
        <div className="glass-panel">
          <h3 className="text-xl font-bold mb-6">Parametric Trigger Activity</h3>
          <div className="flex flex-col gap-4">
            <TriggerItem zone={data?.aiPrediction?.highRiskZones?.[0] || 'Unknown'} type="Forecast: High Traffic Delay" status="Engine Watching" time="Live" active/>
            <TriggerItem zone="Koramangala" type="Rainfall > 40mm/hr" status="Auto-Approve Running" time="2 mins ago" active/>
            <TriggerItem zone="Delhi NCR" type="AQI Index > 450" status="Fraud Checks Running" time="5 hrs ago" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, isAlert }) {
  return (
    <div className={`glass-panel flex flex-col justify-center p-5 ${isAlert ? 'border-red-500/50 bg-red-500/5' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-textMuted text-xs font-semibold uppercase tracking-wider">{title}</h4>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function TriggerItem({ zone, type, status, time, active }) {
  return (
    <div className="flex flex-col p-4 rounded-lg bg-card border border-white/5 relative overflow-hidden">
      {active && <div className="absolute top-0 left-0 w-1 h-full bg-accent animate-pulse"></div>}
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm tracking-wide">{zone}</span>
        <span className="text-xs text-textMuted">{time}</span>
      </div>
      <div className="text-sm font-medium text-textLight">{type}</div>
      <div className={`text-xs mt-2 font-semibold ${active ? 'text-accent' : 'text-textMuted'}`}>
        {status}
      </div>
    </div>
  );
}
