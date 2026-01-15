
import React, { useState, useEffect, useRef } from 'react';
import { Screen, Lab, User, State, AppNotification, Language, Role } from './types';
import { LOGO_URL, STATES_LIST, MOCK_LABS, MOCK_NOTIFICATIONS, BRAND_COLORS, LANGUAGES, TRANSLATIONS } from './constants';
import { Button } from './components/Button';
import { Input } from './components/Input';

const VCLogo = ({ size = "120", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" className={className}>
    <defs>
      <radialGradient id="vcGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: BRAND_COLORS.teal }} />
        <stop offset="100%" style={{ stopColor: BRAND_COLORS.deepBlue }} />
      </radialGradient>
    </defs>
    <rect width="1024" height="1024" rx="200" fill="url(#vcGradient)" />
    <path d="M220 330L380 700L450 700L610 330H520L415 580L310 330H220Z" fill="white" />
    <path d="M750 330C660 330 580 380 540 460L620 500C640 450 690 420 750 420C810 420 860 460 860 520C860 580 810 620 750 620C690 620 640 590 620 540L540 580C580 660 660 710 750 710C860 710 950 630 950 520C950 410 860 330 750 330Z" fill="white" />
    <text x="512" y="840" fill="rgba(255,255,255,0.8)" fontSize="70" fontFamily="Inter, sans-serif" textAnchor="middle" letterSpacing="10" fontWeight="400">VOLUNTEER CONNECT</text>
  </svg>
);

const FieldLabel = ({ children }: { children?: React.ReactNode }) => (
  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{children}</label>
);

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('SPLASH');
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('VOLUNTEER');
  const [language, setLanguage] = useState<Language>('EN');
  const [labs, setLabs] = useState<Lab[]>(MOCK_LABS);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Lab>>({});
  // Removed activeDetailTab state as tabs are removed from Lab Detail screen
  const [activeListTab, setActiveListTab] = useState<'STATUS' | 'DETAILS'>('STATUS');

  const t = TRANSLATIONS[language];
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLab = labs.find(l => l.id === selectedLabId);

  useEffect(() => {
    if (screen === 'SPLASH') {
      const timer = setTimeout(() => setScreen('LOGIN'), 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Reset list tab to STATUS when entering LAB_LIST to ensure "Direct Show" of status
  useEffect(() => {
    if (screen === 'LAB_LIST') {
      setActiveListTab('STATUS');
    }
  }, [screen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: role === 'VOLUNTEER' ? 'Anand Mishra' : 'Admin Facility',
      email: role === 'VOLUNTEER' ? 'anand@volunteer.com' : 'client@hospital.com',
      mobile: '9876543210',
      volNo: 'VC-777',
      state: State.Maharashtra,
      role: role
    });
    setScreen(role === 'VOLUNTEER' ? 'MAIN' : 'CLIENT_DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('LOGIN');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const updateLabData = (updatedLab: Lab) => {
    setLabs(prev => {
      const exists = prev.some(l => l.id === updatedLab.id);
      if (exists) {
        return prev.map(l => l.id === updatedLab.id ? updatedLab : l);
      }
      return [...prev, updatedLab];
    });
    setScreen('CLIENT_DASHBOARD');
    alert("Facility Intelligence Updated Successfully");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const LanguageSelector = () => (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsLangOpen(!isLangOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/80 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#007DA5] group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span className="text-[10px] font-black text-[#1A005B] uppercase tracking-widest">
          {LANGUAGES.find(l => l.code === language)?.label}
        </span>
      </button>

      {isLangOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
          <div className="p-2 grid grid-cols-1">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsLangOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${language === lang.code ? 'bg-[#007DA5]/5 text-[#007DA5]' : 'hover:bg-gray-50 text-gray-600'}`}
              >
                <span className="text-xs font-bold">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderScreen = () => {
    const fadeIn = "animate-[fadeIn_0.5s_ease-out]";

    switch (screen) {
      case 'SPLASH':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFF] overflow-hidden">
            <div className="relative animate-[vcLogoEntrance_1.8s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
              <VCLogo size="220" />
            </div>
            <div className="mt-12 text-center animate-[textFadeUp_1s_ease-out_1.2s_both]">
              <h1 className="text-3xl font-black tracking-tight text-[#1A005B]">VOLUNTEER <span className="text-[#007DA5]">CONNECT</span></h1>
              <p className="mt-3 text-gray-400 font-bold tracking-[0.2em] text-[10px] uppercase">Building Tomorrow • Together</p>
            </div>
          </div>
        );

      case 'LOGIN':
        return (
          <div className={`max-w-md mx-auto py-12 px-8 ${fadeIn}`}>
            <div className="flex justify-end mb-6">
              <LanguageSelector />
            </div>

            <div className="text-center mb-10">
              <VCLogo size="80" className="mx-auto mb-6 shadow-2xl rounded-2xl" />
              <h1 className="text-3xl font-extrabold text-[#1A005B] mb-2 tracking-tight">{t.welcome}</h1>
              <p className="text-gray-400 font-medium">{t.signIn}</p>
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-10">
              <button onClick={() => setRole('VOLUNTEER')} className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${role === 'VOLUNTEER' ? 'bg-white text-[#1A005B] shadow-md' : 'text-gray-400'}`}>{t.asVolunteer}</button>
              <button onClick={() => setRole('CLIENT')} className={`flex-1 py-3.5 rounded-xl text-xs font-black transition-all ${role === 'CLIENT' ? 'bg-white text-[#1A005B] shadow-md' : 'text-gray-400'}`}>{t.asClient}</button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <Input label={t.mobile} type="tel" placeholder="+91" required />
              <Input label={t.password} type="password" placeholder="••••••••" required />
              <div className="flex justify-end">
                <button type="button" onClick={() => setScreen('FORGOT_PASSWORD')} className="text-[10px] font-black text-[#007DA5] uppercase tracking-widest">{t.forgotPass}</button>
              </div>
              <Button type="submit" fullWidth>{t.login}</Button>
            </form>

            <div className="mt-12 text-center">
              <button onClick={() => setScreen('SIGNUP')} className="text-[#007DA5] text-sm font-black uppercase tracking-widest hover:underline underline-offset-8">{t.signup}</button>
            </div>
          </div>
        );

      case 'FORGOT_PASSWORD':
        return (
          <div className={`max-w-md mx-auto py-16 px-8 ${fadeIn}`}>
            <button onClick={() => setScreen('LOGIN')} className="mb-8 p-3 bg-gray-50 rounded-2xl text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
            <h1 className="text-3xl font-black text-[#1A005B] mb-2 tracking-tight">Recover Access</h1>
            <p className="text-gray-400 mb-10">Authentication required for retrieval.</p>
            <form className="space-y-8">
              <Input label="Mobile Identity" type="tel" placeholder="+91" required />
              <Button type="button" fullWidth onClick={() => alert("Verification Transmitted")}>Transmit Security Key</Button>
            </form>
          </div>
        );

      case 'SIGNUP':
        return (
          <div className={`max-w-md mx-auto py-12 px-8 ${fadeIn}`}>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-2xl font-black text-[#1A005B] tracking-tight">{t.createAccount}</h1>
              <LanguageSelector />
            </div>
            <form className="space-y-4">
              <Input label="Full Name" placeholder="Volunteer Name" required />
              <Input label="Mobile Vector" type="tel" placeholder="+91" required />
              <Button type="button" onClick={() => setScreen('LOGIN')} fullWidth>Establish Identity</Button>
            </form>
          </div>
        );

      case 'MAIN':
        return (
          <div className={`min-h-screen ${fadeIn}`}>
            <header className="bg-white border-b sticky top-0 z-20 px-6 py-5 flex justify-between items-center">
              <VCLogo size="32" className="rounded-lg shadow-sm" />
              <div className="flex items-center space-x-3">
                <LanguageSelector />
                <button onClick={() => setScreen('NOTIFICATIONS')} className="relative p-2.5 bg-gray-50 rounded-xl text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>
                <button onClick={handleLogout} className="p-2.5 text-gray-300 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" /></svg></button>
              </div>
            </header>
            <main className="px-6 py-10">
              <div className="mb-10 pt-2 animate-[fadeIn_0.5s_ease-out_0.2s_both]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">{getGreeting()}</p>
                <h1 className="text-3xl font-black text-[#1A005B] tracking-tighter leading-none">
                  {user?.name || 'Volunteer'} <span className="text-[#007DA5]">.</span>
                </h1>
              </div>

              <h2 className="text-xl font-black text-[#1A005B] mb-8">{t.explore}</h2>
              <div className="grid grid-cols-2 gap-5">
                {STATES_LIST.map((state) => (
                  <button key={state} onClick={() => { setSelectedState(state); setScreen('LAB_LIST'); }} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all text-left">
                    <span className="font-black text-gray-800 tracking-tight block text-sm">{state}</span>
                  </button>
                ))}
              </div>
            </main>
          </div>
        );

      case 'CLIENT_DASHBOARD':
        return (
          <div className={`min-h-screen bg-gray-50 ${fadeIn}`}>
            <header className="bg-white border-b px-6 py-6 flex justify-between items-center sticky top-0 z-20">
              <h1 className="text-lg font-black text-[#1A005B] tracking-tight">{t.clientDashboard}</h1>
              <div className="flex items-center space-x-2">
                <LanguageSelector />
                <button onClick={handleLogout} className="p-2.5 text-gray-400 hover:text-red-500 transition-colors">Logout</button>
              </div>
            </header>
            <main className="p-6">
              <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-white mb-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Infrastructure Control</h3>
                <div className="space-y-4">
                  {labs.map(lab => (
                    <div key={lab.id} className="p-6 bg-gray-50 rounded-[2rem] flex justify-between items-center border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                      <div>
                        <p className="font-black text-[#1A005B] text-lg">{lab.name}</p>
                        <p className="text-[9px] font-black text-gray-400 uppercase">{lab.state} • {lab.status}</p>
                      </div>
                      <Button variant="secondary" size="sm" className="rounded-xl px-4 py-2 border-none bg-[#007DA5]/10 text-[#007DA5]" onClick={() => { 
                        setSelectedLabId(lab.id); 
                        setFormData(lab);
                        setScreen('ADD_HUB'); 
                      }}>{t.updateDetail}</Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button fullWidth size="lg" className="rounded-[2.5rem] py-6 shadow-[#007DA5]/20" onClick={() => { 
                const newId = Math.random().toString(36).substr(2, 9);
                setSelectedLabId(newId); 
                setFormData({
                  id: newId,
                  name: '',
                  state: State.Maharashtra,
                  status: 'Active',
                  detail: '',
                  volunteerGender: 'Male / Female',
                  periodCount: '1',
                  condition: 'Fed / Fast',
                  amount: '0'
                });
                setScreen('ADD_HUB'); 
              }}>+ {t.addHub}</Button>
            </main>
          </div>
        );

      case 'ADD_HUB':
        return (
          <div className={`min-h-screen bg-[#F8FAFC] ${fadeIn}`}>
            <header className="px-6 py-6 flex items-center border-b bg-white sticky top-0 z-20">
              <button onClick={() => setScreen('CLIENT_DASHBOARD')} className="mr-5 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-[#1A005B]">Back</button>
              <h1 className="text-lg font-black text-[#1A005B]">Hub Intelligence Protocol</h1>
            </header>
            <main className="p-6 pb-20 space-y-6">
              <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
                <Input label="Hub Designation" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Official Facility Name" />
                <Input label="Operational Narrative" value={formData.detail || ''} onChange={e => setFormData({...formData, detail: e.target.value})} placeholder="Detailed mission scope" />
              </div>

              <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>Volunteer Profile</FieldLabel>
                    <select 
                      value={formData.volunteerGender || 'Male / Female'} 
                      onChange={e => setFormData({...formData, volunteerGender: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1A005B] outline-none"
                    >
                      <option>Male / Female</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Operational Periods</FieldLabel>
                    <select 
                      value={formData.periodCount || '1'} 
                      onChange={e => setFormData({...formData, periodCount: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1A005B] outline-none"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n.toString()}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Input label="In-House Specifications" value={formData.inHouse || ''} onChange={e => setFormData({...formData, inHouse: e.target.value})} placeholder="Internal deployment details" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>Feeding Condition</FieldLabel>
                    <select 
                      value={formData.condition || 'Fed / Fast'} 
                      onChange={e => setFormData({...formData, condition: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold text-[#1A005B] outline-none"
                    >
                      <option>Fed / Fast</option>
                      <option>Fed</option>
                      <option>Fast</option>
                    </select>
                  </div>
                  <Input label="Blood Loss (ml)" value={formData.lossMl || ''} onChange={e => setFormData({...formData, lossMl: e.target.value})} placeholder="ml" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Input label="Ambulatory Data" value={formData.ambulatory || ''} onChange={e => setFormData({...formData, ambulatory: e.target.value})} placeholder="Status description" />
                  <Input label="BMI Target" value={formData.bmi || ''} onChange={e => setFormData({...formData, bmi: e.target.value})} placeholder="Range / Target" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Input label="Target Age Range" value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="Ex: 18-45" />
                  <div className="relative">
                    <FieldLabel>Reimbursement Amount</FieldLabel>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-red-600 font-black text-lg">₹</span>
                      <input 
                        type="text" 
                        value={formData.amount || ''} 
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                        className="w-full bg-red-50 border border-red-100 rounded-xl px-10 py-3.5 text-lg font-black text-red-600 outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
                <FieldLabel>Phase Logisitics</FieldLabel>
                <Input label="Period 1" value={formData.period1 || ''} onChange={e => setFormData({...formData, period1: e.target.value})} placeholder="Phase 1 Details" />
                <Input label="Period 2" value={formData.period2 || ''} onChange={e => setFormData({...formData, period2: e.target.value})} placeholder="Phase 2 Details" />
                <Input label="Period 3" value={formData.period3 || ''} onChange={e => setFormData({...formData, period3: e.target.value})} placeholder="Phase 3 Details" />
                <Input label="Period 4" value={formData.period4 || ''} onChange={e => setFormData({...formData, period4: e.target.value})} placeholder="Phase 4 Details" />
              </div>

              <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto z-30">
                <Button fullWidth size="lg" className="rounded-3xl shadow-2xl py-6" onClick={() => updateLabData(formData as Lab)}>Update Facility Protocol</Button>
              </div>
            </main>
          </div>
        );

      case 'LAB_LIST':
        const filteredLabs = labs.filter(lab => lab.state === selectedState);
        return (
          <div className={`min-h-screen bg-[#F8FAFC] ${fadeIn}`}>
            <header className="bg-white border-b px-6 py-5 flex items-center sticky top-0 z-20">
              <button onClick={() => setScreen('MAIN')} className="mr-5 p-3 bg-gray-50 rounded-2xl text-gray-400">Back</button>
              <h1 className="text-lg font-black text-[#1A005B]">{selectedState} Nodes</h1>
            </header>
            <main className="px-6 py-8">
              {/* Tab Selector for Lab List Screen */}
              <div className="flex bg-gray-200 p-1 rounded-[2rem] mb-8 max-w-[320px] mx-auto shadow-inner">
                <button 
                  onClick={() => setActiveListTab('STATUS')}
                  className={`flex-1 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeListTab === 'STATUS' ? 'bg-white text-[#1A005B] shadow-md transform scale-[1.05]' : 'text-gray-400 hover:text-gray-500'}`}
                >
                  Status
                </button>
                <button 
                  onClick={() => setActiveListTab('DETAILS')}
                  className={`flex-1 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeListTab === 'DETAILS' ? 'bg-white text-[#1A005B] shadow-md transform scale-[1.05]' : 'text-gray-400 hover:text-gray-500'}`}
                >
                  All Details
                </button>
              </div>

              <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
                {filteredLabs.length > 0 ? filteredLabs.map(lab => (
                  <div 
                    key={lab.id} 
                    onClick={() => { setSelectedLabId(lab.id); setScreen('LAB_DETAIL'); }} 
                    className={`p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
                  >
                    <div className="relative z-10">
                      <h3 className="font-black text-gray-800 text-xl tracking-tighter mb-4 group-hover:text-[#007DA5] transition-colors">{lab.name}</h3>
                      
                      {activeListTab === 'STATUS' ? (
                        <div className="flex items-center space-x-3">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${lab.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                            {lab.status}
                          </span>
                          {lab.amount && <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">₹{lab.amount} Grant</span>}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4 mt-4 animate-[fadeIn_0.3s_ease-out]">
                           {lab.volunteerGender && (
                             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">Profile</p>
                               <p className="text-[10px] font-black text-[#1A005B]">{lab.volunteerGender}</p>
                             </div>
                           )}
                           {lab.age && (
                             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">Age Range</p>
                               <p className="text-[10px] font-black text-[#1A005B]">{lab.age}</p>
                             </div>
                           )}
                           {lab.condition && (
                             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                               <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-1">Feeding</p>
                               <p className="text-[10px] font-black text-[#1A005B]">{lab.condition}</p>
                             </div>
                           )}
                           {lab.amount && (
                             <div className="bg-red-50 p-4 rounded-2xl border border-red-100 shadow-sm">
                               <p className="text-[7px] font-black text-red-300 uppercase tracking-widest mb-1">Grant</p>
                               <p className="text-[10px] font-black text-red-600">₹{lab.amount}</p>
                             </div>
                           )}
                        </div>
                      )}
                    </div>
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[4rem]"></div>
                  </div>
                )) : (
                  <div className="text-center py-24 text-gray-300 font-black uppercase tracking-[0.4em] text-xs">Zero Nodes in {selectedState}</div>
                )}
              </div>
            </main>
          </div>
        );

      case 'LAB_DETAIL':
        if (!selectedLab) return null;
        return (
          <div className={`min-h-screen bg-white ${fadeIn}`}>
            <header className="px-6 py-5 flex items-center border-b bg-white sticky top-0 z-20">
              <button onClick={() => setScreen('LAB_LIST')} className="mr-5 p-3 bg-gray-50 rounded-2xl text-gray-400">Back</button>
              <h1 className="text-lg font-black text-[#1A005B] truncate">{selectedLab.name}</h1>
            </header>
            <main className="pb-12">
              <div className="px-8 pt-8">
                <div className="h-48 bg-gradient-to-br from-[#1A005B] to-[#007DA5] rounded-[3.5rem] mb-8 flex items-center justify-center shadow-2xl relative overflow-hidden">
                  <VCLogo size="120" />
                  <div className="absolute top-0 right-0 p-8 opacity-10 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                </div>

                <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
                  {/* Status Section */}
                  <div className="p-10 bg-gray-50 rounded-[4rem] border border-gray-100 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-4xl font-black text-[#1A005B] tracking-tighter leading-none">{selectedLab.name}</h2>
                      <span className="px-3 py-1 bg-[#1A005B] text-white text-[8px] font-black uppercase rounded-full tracking-[0.2em]">{selectedLab.status}</span>
                    </div>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg mb-8">{selectedLab.detail}</p>
                    
                    {selectedLab.amount && (
                      <div className="mt-4 p-6 bg-red-50 rounded-[2.5rem] border border-red-100 shadow-inner inline-block w-full">
                        <div className="flex justify-between items-center">
                          <div>
                              <p className="text-[10px] font-black uppercase text-red-400 tracking-[0.2em] mb-1">Grant Allocation</p>
                              <p className="text-4xl font-black text-red-600 tracking-tight">₹{selectedLab.amount}</p>
                          </div>
                          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { label: 'Volunteer', val: selectedLab.volunteerGender },
                      { label: 'Periods', val: selectedLab.periodCount },
                      { label: 'Condition', val: selectedLab.condition },
                      { label: 'BMI Target', val: selectedLab.bmi },
                      { label: 'Age Group', val: selectedLab.age },
                      { label: 'Loss (ml)', val: selectedLab.lossMl },
                      { label: 'Ambulatory', val: selectedLab.ambulatory }
                    ].map((item, i) => item.val && (
                      <div key={i} className="p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm group hover:border-[#007DA5] transition-all">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 group-hover:text-[#007DA5]">{item.label}</p>
                        <p className="font-black text-[#1A005B] tracking-tight text-base">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  {selectedLab.inHouse && (
                    <div className="p-10 bg-gradient-to-br from-[#007DA5]/5 to-white rounded-[3.5rem] border border-[#007DA5]/10 shadow-sm">
                      <p className="text-[10px] font-black uppercase text-[#007DA5] tracking-[0.4em] mb-4">In-House Protocol</p>
                      <p className="font-semibold text-[#1A005B] leading-relaxed text-lg">{selectedLab.inHouse}</p>
                    </div>
                  )}

                  {(selectedLab.period1 || selectedLab.period2 || selectedLab.period3 || selectedLab.period4) && (
                    <div className="p-12 bg-[#1A005B] text-white rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden">
                      <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#007DA5]">Operational Phases</h3>
                      <div className="space-y-8 relative z-10">
                        {[selectedLab.period1, selectedLab.period2, selectedLab.period3, selectedLab.period4].map((p, idx) => p && (
                          <div key={idx} className="flex space-x-6 items-start group">
                            <div className="h-12 w-12 shrink-0 bg-white/10 rounded-[1.25rem] flex items-center justify-center font-black text-[#007DA5] text-lg border border-white/5">0{idx+1}</div>
                            <div className="pt-1">
                              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#007DA5] mb-2">Phase Vector</p>
                              <p className="font-medium text-blue-50 leading-relaxed text-lg">{p}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-8 text-center pb-8">
                   <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">Volunteer Connect Intelligence Unit</p>
                </div>
              </div>
            </main>
          </div>
        );

      case 'NOTIFICATIONS':
        return (
          <div className={`min-h-screen bg-[#F8FAFC] ${fadeIn}`}>
            <header className="bg-white border-b px-6 py-5 flex items-center sticky top-0 z-20">
              <button onClick={() => setScreen('MAIN')} className="mr-5 p-3 bg-gray-50 rounded-2xl text-gray-400">Back</button>
              <h1 className="text-lg font-black text-[#1A005B]">Intelligence Feed</h1>
            </header>
            <main className="p-6">
              {notifications.map(n => (
                <div key={n.id} onClick={() => markNotificationAsRead(n.id)} className={`p-10 mb-6 bg-white border border-gray-100 rounded-[3rem] shadow-sm transition-all hover:shadow-2xl cursor-pointer ${!n.isRead ? 'border-l-[10px] border-l-[#007DA5]' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-2xl text-[#1A005B] tracking-tighter">{n.title}</h4>
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{n.timestamp}</span>
                  </div>
                  <p className="text-gray-400 font-medium leading-relaxed">{n.message}</p>
                </div>
              ))}
            </main>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-white shadow-2xl relative overflow-x-hidden font-['Inter']">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes vcLogoEntrance {
          0% { opacity: 0; transform: scale(0.3) rotate(-15deg); filter: blur(20px); }
          50% { opacity: 1; transform: scale(1.1) rotate(2deg); filter: blur(0); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes textFadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        select { appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231A005B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1rem; }
      `}</style>
      {renderScreen()}
    </div>
  );
};

export default App;
