import { Shield, CloudRain, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="w-full flex flex-col items-center mt-12 animate-in fade-in duration-700">
      <div className="text-center max-w-3xl mb-16 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full point-events-none -z-10"></div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
          AI Insurance for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-400">
            Delivery Partners
          </span>
        </h1>
        <p className="text-xl text-textMuted mb-10 leading-relaxed font-light">
          GigShield protects your income against external disruptions like weather, pollution, curfews, and traffic shutdowns. Automated claims. No paperwork.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary text-lg px-8 py-3 flex items-center gap-2">
            Get Covered Now <Shield size={20}/>
          </Link>
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10">
            Learn More
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <FeatureCard 
          icon={<CloudRain size={32} className="text-blue-400"/>}
          title="Weather Protection"
          desc="Automatic income coverage when heavy rain prevents you from delivering."
        />
        <FeatureCard 
          icon={<Activity size={32} className="text-green-400"/>}
          title="Pollution & AQI"
          desc="Get paid even when dangerous AQI levels or pollution stops your work."
        />
        <FeatureCard 
          icon={<ShieldAlert size={32} className="text-orange-400"/>}
          title="Curfews & Traffic"
          desc="Coverage for sudden civic unrest, curfews, or massive transit shutdowns."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="glass-panel hover:border-accent/50 transition-all hover:-translate-y-1 duration-300 group cursor-pointer">
      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-textMuted leading-relaxed">{desc}</p>
    </div>
  );
}
