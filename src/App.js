import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Briefcase, Users, Building2, TrendingUp, CheckCircle2, 
  MessageSquare, Bell, User, Menu, X, Filter, DollarSign, Star, 
  ChevronRight, ArrowRight, ShieldCheck, Globe, Zap, BarChart3, 
  LayoutDashboard, Send, Plus, Bookmark, Clock, Moon, Sun,
  ChevronLeft, FileText, Settings, LogOut, PieChart, UserPlus,
  BriefcaseBusiness, ListFilter, PlusCircle
} from 'lucide-react';

// --- INITIAL MOCK DATA ---

const INITIAL_COMPANIES = [
  { id: 1, name: "Google" },
  { id: 2, name: "Amazon" },
  { id: 3, name: "Microsoft" },
  { id: 4, name: "Shopify" },
  { id: 5, name: "Stripe" },
  { id: 6, name: "Airbnb" },
];

const INITIAL_JOBS = [
  { id: 1, title: "Senior React Engineer", company: "Stripe", location: "Remote", salary: "$140k - $180k", type: "Full-time", category: "Software Development", posted: "2h ago", tags: ["React", "TypeScript", "Node.js"] },
  { id: 2, title: "Product Designer", company: "Airbnb", location: "San Francisco, CA", salary: "$120k - $160k", type: "Full-time", category: "Design", posted: "5h ago", tags: ["Figma", "UX Research", "UI Design"] },
  { id: 3, title: "AI Research Scientist", company: "Google", location: "Mountain View, CA", salary: "$200k - $300k", type: "Full-time", category: "AI & Data", posted: "1d ago", tags: ["Python", "PyTorch", "NLP"] },
  { id: 4, title: "Marketing Manager", company: "Shopify", location: "Remote", salary: "$90k - $130k", type: "Full-time", category: "Marketing", posted: "3h ago", tags: ["SEO", "Content Strategy", "Ads"] },
  { id: 5, title: "DevOps Architect", company: "Microsoft", location: "Seattle, WA", salary: "$160k - $210k", type: "Full-time", category: "Software Development", posted: "8h ago", tags: ["Azure", "Kubernetes", "Docker"] },
];

const FREELANCERS = [
  { id: 1, name: "Savannah Enright", expertise: "Management Consultant", previouslyAt: "BCG", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800", rate: "$180/hr", rating: 5.0, bg: "bg-green-50" },
  { id: 2, name: "Arvind Kumar", expertise: "FP&A Expert", previouslyAt: "Goldman Sachs", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800", rate: "$150/hr", rating: 4.9, bg: "bg-blue-50" },
  { id: 3, name: "Erita Skendaj", expertise: "Project Manager", previouslyAt: "AWS", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800", rate: "$140/hr", rating: 4.8, bg: "bg-green-50" },
];

// --- BRANDING COMPONENTS ---

const Logo = ({ className = "", onClick }) => (
  <div className={`flex items-center gap-3 cursor-pointer group ${className}`} onClick={onClick}>
    <div className="relative w-14 h-14 shrink-0 transition-transform group-hover:scale-105">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="white" />
        <defs>
          <clipPath id="circleClip">
            <circle cx="50" cy="50" r="46" />
          </clipPath>
        </defs>
        <g clipPath="url(#circleClip)">
          <path d="M28,48 Q50,12 72,48 L66,54 Q50,42 34,54 Z" fill="#2d8a41" />
          <circle cx="50" cy="30" r="7.5" fill="#2d8a41" />
          <rect x="0" y="51" width="100" height="1.2" fill="#2d8a41" />
          <rect x="0" y="54.5" width="100" height="1.2" fill="#20498a" />
          <path d="M20,56 L32,100 H44 L50,84 L56,100 H68 L80,56 H66 L50,80 L34,56 Z" fill="#20498a" />
          <path d="M0,56 H100 V100 H0 Z" fill="#20498a" fillOpacity="0.05" />
        </g>
      </svg>
    </div>
    <div className="flex flex-col leading-none">
      <div className="text-2xl font-bold font-poppins tracking-tight flex items-baseline">
        <span className="text-[#20498a]">World</span> 
        <span className="text-[#2d8a41] ml-1.5">Hiring</span>
      </div>
      <span className="text-[10px] font-bold text-[#4a4a4a] uppercase tracking-wider mt-1.5">Bridge to Job Opportunities</span>
    </div>
  </div>
);

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-[#20498a]",
    green: "bg-green-50 text-[#2d8a41]",
    gray: "bg-gray-100 text-gray-700",
  };
  return <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${colors[color]}`}>{children}</span>;
};

// --- HELPER COMPONENTS ---

const Calendar = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);

const LogoCarousel = () => (
  <section className="py-20 bg-white overflow-hidden border-t border-slate-50">
    <div className="container mx-auto px-6 mb-12 text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-4 font-poppins tracking-tight">
        Join top <span className="text-[#20498a]">employers</span> currently hiring
      </h2>
      <div className="h-1 w-20 bg-[#2d8a41] mx-auto rounded-full"></div>
    </div>
    <div className="relative flex overflow-x-hidden group">
      <div className="flex py-12 whitespace-nowrap animate-infinite-scroll group-hover:pause-scroll">
        {[...INITIAL_COMPANIES, ...INITIAL_COMPANIES].map((company, idx) => (
          <div key={idx} className="mx-12 flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 bg-[#20498a] rounded-xl flex items-center justify-center text-white text-xl font-black italic">{company.name[0]}</div>
            <span className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-infinite-scroll { animation: scroll 30s linear infinite; }
      .pause-scroll { animation-play-state: paused; }
    `}} />
  </section>
);

const CandidateCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeCandidate = FREELANCERS[activeIndex];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setActiveIndex(p => (p + 1) % FREELANCERS.length), 5000);
    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

  return (
    <div className="relative w-full h-full max-h-[420px]" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      <div className={`relative h-full w-full rounded-3xl overflow-hidden transition-colors duration-700 ${activeCandidate.bg} border border-slate-100 shadow-lg`}>
        <div className="relative z-10 flex h-full">
          <div className="w-1/2 flex items-end justify-center">
             <div className="w-full h-full relative">
                <img key={activeCandidate.id} src={activeCandidate.image} alt={activeCandidate.name} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[90%] object-cover rounded-t-full shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500" />
             </div>
          </div>
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-50 max-w-sm">
               <h3 className="text-xl font-bold text-slate-900 mb-1">{activeCandidate.name}</h3>
               <div className="flex items-center gap-2 mb-3 text-[#2d8a41] font-bold text-xs"><CheckCircle2 size={14} /> Verified Professional</div>
               <div className="flex items-center gap-2 text-slate-500 text-xs mb-4"><TrendingUp size={14} className="text-[#20498a]" /> {activeCandidate.expertise}</div>
               <div className="pt-4 border-t border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Previous Experience</p>
                  <div className="text-lg font-black text-[#20498a] italic">{activeCandidate.previouslyAt}</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PAGE COMPONENTS ---

const AuthPage = ({ mode = 'login', onComplete }) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-6">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border border-slate-50">
        <div className="text-center mb-10">
          <Logo className="justify-center mb-6" />
          <h2 className="text-3xl font-bold text-slate-900">{mode === 'login' ? 'Welcome Back' : 'Join World Hiring'}</h2>
          <p className="text-slate-500 mt-2">{mode === 'login' ? 'Access your professional bridge today.' : 'Start your journey to global opportunities.'}</p>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onComplete(); }}>
          {mode === 'signup' && (
            <div className="flex gap-4">
               <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2">First Name</label>
                 <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#20498a] outline-none" placeholder="John" />
               </div>
               <div className="flex-1">
                 <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Last Name</label>
                 <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#20498a] outline-none" placeholder="Doe" />
               </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
            <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#20498a] outline-none" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#20498a] outline-none" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-[#20498a] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[#1a3d75] transition mt-4">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- EMPLOYER SPECIFIC COMPONENTS ---

const JobPostModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ title: '', location: '', salary: '', tags: '', type: 'Full-time' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X size={24} /></button>
        <div className="mb-8">
           <h2 className="text-2xl font-black text-[#20498a] mb-2">Post a New Job</h2>
           <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Bridge your next project with top talent</p>
        </div>
        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); onClose(); }}>
           <div>
             <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Job Title</label>
             <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#20498a]" placeholder="e.g. Senior Product Architect" />
           </div>
           <div className="flex gap-4">
             <div className="flex-1">
               <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Location</label>
               <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" placeholder="Remote / City" />
             </div>
             <div className="flex-1">
               <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Salary Range</label>
               <input required value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" placeholder="$120k - $160k" />
             </div>
           </div>
           <div>
             <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Technical Tags (comma separated)</label>
             <input required value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none" placeholder="React, Python, AWS" />
           </div>
           <button type="submit" className="w-full bg-[#2d8a41] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-[#257336] transition flex items-center justify-center gap-2">
             <PlusCircle size={20} /> Publish Job Posting
           </button>
        </form>
      </div>
    </div>
  );
};

const EmployerDashboard = ({ onPostJob, employerJobs }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Active Jobs', val: employerJobs.length, icon: <BriefcaseBusiness />, color: 'blue' },
        { label: 'Total Apps', val: '342', icon: <Users />, color: 'green' },
        { label: 'Shortlisted', val: '45', icon: <CheckCircle2 />, color: 'blue' },
        { label: 'Unread Msgs', val: '12', icon: <MessageSquare />, color: 'gray' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className={`p-2 w-fit mb-4 rounded-lg bg-${stat.color === 'blue' ? 'blue-50' : stat.color === 'green' ? 'green-50' : 'slate-50'} text-${stat.color === 'blue' ? '[#20498a]' : stat.color === 'green' ? '[#2d8a41]' : 'slate-600'}`}>
            {React.cloneElement(stat.icon, { size: 20 })}
          </div>
          <div className="text-2xl font-black text-slate-900">{stat.val}</div>
          <div className="text-slate-400 font-bold text-[10px] uppercase">{stat.label}</div>
        </div>
      ))}
    </div>

    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-[2] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-[#20498a] flex items-center gap-2"><ListFilter size={20} /> My Active Postings</h3>
          <button onClick={onPostJob} className="bg-[#20498a] text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-[#1a3d75] transition shadow-md">
            <Plus size={16} /> New Job
          </button>
        </div>
        <div className="p-4">
          {employerJobs.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold italic">No active jobs posted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-wider">
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Applicants</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {employerJobs.map(j => (
                    <tr key={j.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-900">{j.title}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{j.location} • {j.salary}</div>
                      </td>
                      <td className="px-6 py-4"><span className="text-sm font-black text-[#20498a]">24</span> <span className="text-[10px] text-slate-400 font-bold">New</span></td>
                      <td className="px-6 py-4"><Badge color="green">Live</Badge></td>
                      <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-[#20498a] transition"><Settings size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-6">
        <div className="bg-[#20498a] p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
           <div className="relative z-10">
             <h4 className="text-xl font-bold mb-2">Talent Sourcing</h4>
             <p className="text-blue-100 text-sm mb-6 leading-relaxed">Access our pre-vetted pool of top 3% global talent to fill roles 4x faster.</p>
             <button className="w-full bg-[#2d8a41] text-white py-3 rounded-xl font-black shadow-lg hover:bg-[#257336] transition">Search Talent Pool</button>
           </div>
           <PieChart className="absolute -bottom-4 -right-4 text-white opacity-10 w-24 h-24 rotate-12" />
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN WRAPPER ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState('candidate'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handlePostJob = (newJobData) => {
    const newJob = {
      id: jobs.length + 1,
      title: newJobData.title,
      company: "WorldHiring Partner", // In real app, this would be the logged-in company name
      location: newJobData.location,
      salary: newJobData.salary,
      type: newJobData.type,
      posted: "Just now",
      tags: newJobData.tags.split(',').map(t => t.trim())
    };
    setJobs([newJob, ...jobs]);
  };

  const employerPostings = jobs.filter(j => j.company === "WorldHiring Partner");

  return (
    <div className="min-h-screen font-inter bg-white text-slate-900">
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Logo onClick={() => navigate('home')} />

          <nav className="hidden lg:flex items-center gap-10">
            {['home', 'jobs', 'freelancers'].map((page) => (
              <button key={page} onClick={() => navigate(page)} className={`capitalize font-bold transition hover:text-[#20498a] ${currentPage === page ? 'text-[#20498a]' : 'text-slate-500'}`}>{page}</button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl items-center mr-2">
               <button onClick={() => { setUserRole('candidate'); isLoggedIn && navigate('dashboard'); }} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${userRole === 'candidate' ? 'bg-white shadow-sm text-[#2d8a41]' : 'text-slate-400 hover:text-slate-600'}`}>Candidate</button>
               <button onClick={() => { setUserRole('employer'); isLoggedIn && navigate('dashboard'); }} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition ${userRole === 'employer' ? 'bg-white shadow-sm text-[#20498a]' : 'text-slate-400 hover:text-slate-600'}`}>Employer</button>
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('dashboard')} className={`flex items-center gap-2 group p-1.5 rounded-full border transition ${userRole === 'candidate' ? 'border-[#2d8a41]/20 bg-green-50' : 'border-[#20498a]/20 bg-blue-50'}`}>
                  <User size={18} className={userRole === 'candidate' ? 'text-[#2d8a41]' : 'text-[#20498a]'} />
                  <span className="text-[10px] font-black uppercase pr-2">My Portal</span>
                </button>
                <button onClick={() => { setIsLoggedIn(false); navigate('home'); }} className="p-2 text-slate-400 hover:text-red-500 transition"><LogOut size={20}/></button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('login')} className="hidden sm:block text-slate-500 font-bold hover:text-[#20498a] transition">Sign In</button>
                <button onClick={() => navigate('signup')} className="bg-[#20498a] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-[#1a3d75] transition flex items-center gap-2"><UserPlus size={16} /> Sign Up</button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20 min-h-[90vh]">
        {currentPage === 'home' && <HomePage jobs={jobs} onNavigate={navigate} />}
        {currentPage === 'jobs' && <JobsPage jobs={jobs} />}
        {currentPage === 'freelancers' && <JobsPage jobs={jobs} />}
        {(currentPage === 'login' || currentPage === 'signup') && (
           <AuthPage mode={currentPage} onComplete={() => { setIsLoggedIn(true); navigate('dashboard'); }} />
        )}
        {currentPage === 'dashboard' && (
           <div className="py-12 bg-slate-50 min-h-screen">
             <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                  <h1 className="text-4xl font-black text-slate-900 font-poppins tracking-tight">{userRole === 'candidate' ? 'Candidate Dashboard' : 'Recruiter Hub'}</h1>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-sm"><Calendar className="inline" size={16} /> March 2026</div>
                </div>
                {userRole === 'candidate' ? <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"><div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 text-center font-bold text-slate-400 italic">Job application tracker and professional profile metrics.</div></div> : <EmployerDashboard employerJobs={employerPostings} onPostJob={() => setIsJobModalOpen(true)} />}
             </div>
           </div>
        )}
      </main>

      <JobPostModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} onSubmit={handlePostJob} />

      <footer className="py-16 border-t border-slate-100 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-xs">
              <Logo className="mb-6" onClick={() => navigate('home')} />
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Bridge to world-class talent and career growth.</p>
            </div>
            <div className="flex gap-16">
              <div><h4 className="font-bold mb-4 text-[#20498a]">Platform</h4><ul className="space-y-3 text-sm text-slate-500"><li className="hover:text-[#2d8a41] cursor-pointer">Find Jobs</li><li className="hover:text-[#2d8a41] cursor-pointer">Post a Job</li></ul></div>
              <div><h4 className="font-bold mb-4 text-[#20498a]">Support</h4><ul className="space-y-3 text-sm text-slate-500"><li className="hover:text-[#2d8a41] cursor-pointer">Help Center</li><li className="hover:text-[#2d8a41] cursor-pointer">Terms</li></ul></div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">© 2026 World Hiring — Verified Global Bridge</div>
        </div>
      </footer>
    </div>
  );
}

const HomePage = ({ onNavigate, jobs }) => (
  <div className="animate-in fade-in duration-500">
    <section className="relative pt-8 pb-16 bg-gradient-to-br from-slate-50 via-white to-green-50 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#20498a] px-3 py-1.5 rounded-full text-xs font-bold mb-6"><span className="flex h-2 w-2 rounded-full bg-[#20498a] animate-pulse"></span>Global Talent Bridge</div>
            <h1 className="text-4xl lg:text-6xl font-bold font-poppins text-slate-900 leading-tight mb-6">Hire the world's <br/><span className="text-[#20498a]">top professionals.</span></h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">World Hiring connects exclusive companies with elite developers, designers, and management consultants.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button onClick={() => onNavigate('jobs')} className="bg-[#20498a] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#1a3d75] transition shadow-lg flex items-center justify-center gap-2">Hire Top Talent <ArrowRight size={18} /></button>
              <button onClick={() => onNavigate('jobs')} className="bg-[#2d8a41] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#257336] transition shadow-lg flex items-center justify-center gap-2">Find Jobs</button>
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-2 max-w-2xl">
              <div className="flex-[1.5] flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl"><Search size={18} className="text-slate-400" /><input type="text" placeholder="Job title or keywords" className="bg-transparent w-full focus:outline-none text-sm font-medium text-slate-700" /></div>
              <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl"><MapPin size={18} className="text-[#2d8a41]" /><input type="text" placeholder="Country / City" className="bg-transparent w-full focus:outline-none text-sm font-medium text-slate-700" /></div>
              <button onClick={() => onNavigate('jobs')} className="bg-[#20498a] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1a3d75] transition flex items-center justify-center gap-2"><Search size={16} /> Find</button>
            </div>
          </div>
          <div className="lg:w-1/2 w-full"><CandidateCarousel /></div>
        </div>
      </div>
    </section>

    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div><h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight font-poppins">Featured Positions</h2><p className="text-slate-500 font-medium">Join the elite network of world-class teams.</p></div>
          <button onClick={() => onNavigate('jobs')} className="text-[#20498a] font-bold flex items-center gap-2 hover:gap-3 transition-all">Explore All Jobs <ChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {jobs.slice(0, 4).map((job) => (
            <div key={job.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-8 hover:border-[#20498a]/20 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl font-black text-[#20498a] group-hover:bg-[#20498a] group-hover:text-white transition-colors duration-500">{job.company[0]}</div>
                <Badge color="green">{job.type}</Badge>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#20498a] mb-2 transition-colors">{job.title}</h3>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm font-bold text-slate-500 mb-6"><span className="flex items-center gap-1.5"><Building2 size={16} className="text-[#20498a]" /> {job.company}</span><span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#2d8a41]" /> {job.location}</span></div>
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-50 mb-6">
                <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Salary</p><p className="text-lg font-black text-slate-900 flex items-center gap-1"><DollarSign size={18} className="text-[#2d8a41]" /> {job.salary.replace('$', '')}</p></div>
                <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Posted</p><p className="text-sm font-bold text-slate-500 flex items-center justify-end gap-1"><Clock size={16} /> {job.posted}</p></div>
              </div>
              <div className="flex items-center justify-between"><div className="flex gap-2">{job.tags.slice(0, 2).map(tag => (<span key={tag} className="text-[10px] font-black bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-slate-100">{tag}</span>))}</div><button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#20498a] shadow-lg transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">Quick Apply</button></div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <LogoCarousel />
  </div>
);

const JobsPage = ({ jobs }) => (
  <div className="py-12 bg-slate-50 min-h-screen">
    <div className="container mx-auto px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Available Opportunities</h1>
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-[#20498a] transition flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex gap-4 text-left w-full">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-black text-[#20498a] shrink-0">{job.company[0]}</div>
                <div><h3 className="text-xl font-bold text-slate-900">{job.title}</h3><p className="text-slate-500 font-medium text-sm">{job.company} • {job.location}</p><p className="text-[#2d8a41] font-bold text-sm mt-1">{job.salary}</p></div>
             </div>
             <button className="bg-[#20498a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a3d75] transition w-full md:w-auto">Apply Now</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
