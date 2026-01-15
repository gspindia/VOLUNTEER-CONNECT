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
  const [darkMode, setDarkMode] = useState(false);
  const [labs, setLabs] = useState<Lab[]>(MOCK_LABS);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Lab>>({});
  // Facility Password States
  const [facilityPassword, setFacilityPassword] = useState('');
  const [confirmFacilityPassword, setConfirmFacilityPassword] = useState('');
  
  const [activeListTab, setActiveListTab] = useState<'STATUS' | 'DETAILS'>('STATUS');
  
  // SignUp State
  const [otpSent, setOtpSent] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('');

  const t = TRANSLATIONS[language];
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLab = labs.find(l => l.id === selectedLabId);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (screen === 'SPLASH') {
      const timer = setTimeout(() => setScreen('LOGIN'), 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

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
      email: role === 'VOLUNTEER' ? 'anand@volunteer.com' : 'admin@hospital.com',
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
    setSelectedState(null);
    setSelectedLabId(null);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const updateLabData = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (formData.id) {
      // Update existing
      const originalLab = labs.find(l => l.id === formData.id);
      
      if (!originalLab) {
        alert("Facility not found.");
        return;
      }
      
      if (originalLab.password !== facilityPassword) {
        alert("Incorrect Facility Password. Updates cannot be saved.");
        return;
      }

      setLabs(prev => prev.map(l => l.id === formData.id ? { ...l, ...formData, lastUpdated: timestamp } as Lab : l));
    } else {
      // Create new
      if (facilityPassword !== confirmFacilityPassword) {
         alert("Passwords do not match.");
         return;
      }
      if (!facilityPassword) {
         alert("Please set a password for this facility.");
         return;
      }

      const newLab: Lab = {
        id: Date.now().toString(),
        name: formData.name || 'New Facility',
        state: (formData.state as string) || State.Maharashtra,
        address: formData.address || '',
        status: 'Pending',
        detail: formData.detail || '',
        report: formData.report || 'Pending',
        contact: formData.contact || '',
        phone: formData.phone || '',
        logo: formData.logo,
        password: facilityPassword, // Store the password
        volunteerGender: formData.volunteerGender || 'All',
        inHouse: formData.inHouse || '-',
        periodCount: formData.periodCount || '-',
        condition: formData.condition || '-',
        lossMl: formData.lossMl || '-',
        ambulatory: formData.ambulatory || 'No',
        bmi: formData.bmi || '-',
        age: formData.age || '-',
        amount: formData.amount || '₹ 0',
        period1: formData.period1 || '-',
        period2: formData.period2 || '-',
        period3: formData.period3 || '-',
        period4: formData.period4 || '-',
        screeningDate: formData.screeningDate || '',
        screeningTime: formData.screeningTime || '',
        requirements: formData.requirements || '',
        lastUpdated: timestamp,
        ...formData
      } as Lab;
      setLabs(prev => [newLab, ...prev]);
    }
    
    setScreen('CLIENT_DASHBOARD');
    setFormData({});
    setFacilityPassword('');
    setConfirmFacilityPassword('');
  };

  const deleteLab = (id: string) => {
    const originalLab = labs.find(l => l.id === id);
    if (!originalLab) return;

    if (originalLab.password !== facilityPassword) {
      alert("Incorrect Facility Password. Cannot delete facility.");
      return;
    }

    if (window.confirm('Are you sure you want to delete this facility? This action cannot be undone.')) {
      setLabs(prev => prev.filter(l => l.id !== id));
      setScreen('CLIENT_DASHBOARD');
      setFormData({});
      setFacilityPassword('');
      setConfirmFacilityPassword('');
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const openGoogleMaps = (lab: Lab) => {
    const query = encodeURIComponent(`${lab.name}, ${lab.address || ''}, ${lab.state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const LanguageSelector = ({ direction = 'down' }: { direction?: 'up' | 'down' }) => (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsLangOpen(!isLangOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-all group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#007DA5] dark:text-blue-400 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span className="text-[10px] font-black text-[#1A005B] dark:text-blue-100 uppercase tracking-widest">
          {LANGUAGES.find(l => l.code === language)?.label}
        </span>
      </button>

      {isLangOpen && (
        <div className={`absolute left-0 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-[1.5rem] shadow-2xl z-[60] overflow-hidden animate-[fadeIn_0.2s_ease-out] ${
          direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}>
          <div className="p-2 grid grid-cols-1 max-h-64 overflow-y-auto custom-scrollbar">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsLangOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                  language === lang.code 
                    ? 'bg-[#007DA5]/5 dark:bg-blue-500/10 text-[#007DA5] dark:text-blue-400' 
                    : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300'
                }`}
              >
                <span className="font-bold text-sm">{lang.label}</span>
                {language === lang.code && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const Header = ({ title, showBack = false, showLang = true, showNotification = true }: { title: string, showBack?: boolean, showLang?: boolean, showNotification?: boolean }) => (
    <div className="px-6 pt-12 pb-6 bg-white dark:bg-slate-900 sticky top-0 z-30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] rounded-b-[2rem] transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button onClick={() => {
              if (screen === 'LAB_DETAIL') setScreen('LAB_LIST');
              else if (screen === 'LAB_LIST') setScreen('MAIN');
              else if (screen === 'NOTIFICATIONS') setScreen('MAIN');
              else if (screen === 'ADD_HUB') setScreen('CLIENT_DASHBOARD');
              else if (screen === 'SIGNUP') setScreen('LOGIN');
              else if (screen === 'FORGOT_PASSWORD') setScreen('LOGIN');
              else setScreen('MAIN');
            }} className="p-2 -ml-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
          )}
          {showLang && <LanguageSelector direction="down" />}
        </div>
        
        <div className="flex items-center space-x-2">
           <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-yellow-400 transition-colors"
           >
             {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
             ) : (
                <svg className="w-5 h-5 text-[#1A005B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
             )}
           </button>

          {showNotification && (
            <button onClick={() => setScreen('NOTIFICATIONS')} className="relative p-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <svg className="w-6 h-6 text-[#1A005B] dark:text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.some(n => !n.isRead) && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
              )}
            </button>
          )}
          {user && (
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          )}
        </div>
      </div>
      <h1 className="text-2xl font-black text-[#1A005B] dark:text-blue-100 tracking-tight">{title}</h1>
    </div>
  );

  const renderSplash = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="animate-[pulse_3s_ease-in-out_infinite]">
        <VCLogo />
      </div>
    </div>
  );

  const renderLogin = () => (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 p-8 transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-center items-center">
        <VCLogo size="80" className="mb-8" />
        <h2 className="text-2xl font-bold text-[#1A005B] dark:text-blue-100 mb-2">{t.welcome}</h2>
        <p className="text-gray-400 dark:text-gray-500 mb-8">{t.signIn}</p>

        <div className="flex p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl w-full mb-8 transition-colors">
          <button
            onClick={() => setRole('VOLUNTEER')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              role === 'VOLUNTEER' ? 'bg-white dark:bg-slate-800 text-[#1A005B] dark:text-blue-200 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
            }`}
          >
            {t.asVolunteer}
          </button>
          <button
            onClick={() => setRole('CLIENT')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              role === 'CLIENT' ? 'bg-white dark:bg-slate-800 text-[#1A005B] dark:text-blue-200 shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
            }`}
          >
            {t.asAdmin}
          </button>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <Input 
            placeholder={t.mobile} 
            type="tel" 
            defaultValue={role === 'VOLUNTEER' ? '9876543210' : ''}
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            }
          />
          <Input 
            placeholder={t.password} 
            type="password"
            defaultValue="password"
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            }
          />
          <div className="flex justify-end">
            <button type="button" onClick={() => setScreen('FORGOT_PASSWORD')} className="text-xs font-bold text-[#007DA5] hover:text-[#1A005B] dark:hover:text-blue-200 transition-colors">{t.forgotPass}</button>
          </div>
          <Button fullWidth type="submit" size="lg">
            {t.login}
          </Button>
        </form>

        <div className="mt-8 flex flex-col items-center space-y-4 w-full">
          <div className="relative w-full text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-800"></div></div>
            <span className="relative bg-white dark:bg-slate-950 px-4 text-xs font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest transition-colors">Or</span>
          </div>
          <Button variant="secondary" fullWidth onClick={() => setScreen('SIGNUP')}>
            {t.createAccount}
          </Button>
        </div>
      </div>
      <div className="mt-auto pt-4 flex justify-between items-center px-4">
        <div className="w-8"></div>
        <LanguageSelector direction="up" />
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-500 dark:text-yellow-400 transition-colors"
        >
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5 text-[#1A005B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>
      </div>
    </div>
  );

  const renderSignup = () => (
    <>
      <Header title={t.createAccount} showBack={true} showNotification={false} />
      <div className="px-6 pb-24 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
            <Input placeholder={t.name} />
            <Input placeholder={t.surname} />
            
            <div className="flex gap-2 items-start">
               <div className="flex-1">
                 <Input placeholder={t.mobile} type="tel" />
               </div>
               <button 
                type="button" 
                onClick={() => setOtpSent(true)}
                className="mt-1 px-4 py-3 bg-[#1A005B] text-white text-xs font-bold rounded-xl shadow-sm active:scale-95 transition-all"
               >
                 {t.sendOtp}
               </button>
            </div>
            
            {otpSent && (
              <div className="animate-[fadeIn_0.5s]">
                 <Input placeholder="Enter OTP" className="text-center tracking-widest font-bold" />
                 <p className="text-xs text-green-600 font-bold text-center -mt-2 mb-4">{t.otpSent}</p>
              </div>
            )}

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.gender}</label>
               <div className="flex gap-2">
                 {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                         selectedGender === g 
                         ? 'bg-[#007DA5] text-white border-[#007DA5]' 
                         : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-slate-700 hover:border-gray-300'
                      }`}
                    >
                      {t[g.toLowerCase()] || g}
                    </button>
                 ))}
               </div>
            </div>

            <Input type="date" label={t.dob} />
            <Input placeholder={t.email} type="email" />
            <Input placeholder={t.password} type="password" />
            <Input placeholder={t.confirmPass} type="password" />

            <div className="pt-4">
              <Button fullWidth onClick={() => setScreen('LOGIN')}>{t.submit}</Button>
            </div>
        </div>
      </div>
    </>
  );

  const renderForgotPassword = () => (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 p-8 transition-colors">
      <div className="flex-1 flex flex-col justify-center items-center">
         <VCLogo size="80" className="mb-8" />
         <h2 className="text-2xl font-bold text-[#1A005B] dark:text-blue-100 mb-2">{t.resetPass}</h2>
         <p className="text-gray-400 dark:text-gray-500 mb-8 text-center">{t.enterMobile}</p>

         <div className="w-full space-y-4">
            <Input 
              placeholder={t.mobile} 
              type="tel"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              }
            />
            <Button fullWidth onClick={() => setScreen('LOGIN')}>
               {t.sendOtp}
            </Button>
         </div>
         <div className="mt-8">
            <button onClick={() => setScreen('LOGIN')} className="text-sm font-bold text-[#1A005B] dark:text-blue-200 hover:underline">{t.backToLogin}</button>
         </div>
      </div>
    </div>
  );

  const renderMain = () => (
    <>
      <Header title={t.explore} />
      <div className="p-6 grid grid-cols-2 gap-4 pb-24">
        {STATES_LIST.map((st) => (
          <button
            key={st}
            onClick={() => {
              setSelectedState(st);
              setScreen('LAB_LIST');
            }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-square flex flex-col items-center justify-center gap-4 group border border-gray-100 dark:border-slate-800"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1A005B] to-[#007DA5] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
              {st.charAt(0)}
            </div>
            <span className="font-bold text-[#1A005B] dark:text-blue-100 text-sm">{st}</span>
          </button>
        ))}
      </div>
    </>
  );

  const renderLabList = () => (
    <>
      <Header title={selectedState || 'Facilities'} showBack={true} />
      <div className="px-6 mb-6">
        <div className="bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl flex">
          <button 
             onClick={() => setActiveListTab('STATUS')}
             className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeListTab === 'STATUS' ? 'bg-white dark:bg-slate-800 text-[#1A005B] dark:text-blue-200 shadow-sm' : 'text-gray-400'}`}
          >
            {t.liveStatus}
          </button>
          <button 
             onClick={() => setActiveListTab('DETAILS')}
             className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeListTab === 'DETAILS' ? 'bg-white dark:bg-slate-800 text-[#1A005B] dark:text-blue-200 shadow-sm' : 'text-gray-400'}`}
          >
            {t.allDetails}
          </button>
        </div>
      </div>

      <div className="px-6 pb-24 space-y-4">
        {labs.filter(l => l.state === selectedState).map(lab => (
          <div key={lab.id} onClick={() => { setSelectedLabId(lab.id); setScreen('LAB_DETAIL'); }} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 active:scale-[0.98] transition-all">
             <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="font-bold text-[#1A005B] dark:text-blue-100">{lab.name}</h3>
                   <p className="text-xs text-gray-400 font-bold">{lab.contact}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  lab.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  lab.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                }`}>
                  {lab.status}
                </span>
             </div>
             {activeListTab === 'DETAILS' && (
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-800 grid grid-cols-2 gap-4">
                   <div><FieldLabel>{t.amount}</FieldLabel><p className="font-bold text-sm dark:text-gray-300">{lab.amount}</p></div>
                   <div><FieldLabel>{t.facilities}</FieldLabel><p className="font-bold text-sm dark:text-gray-300">{lab.inHouse}</p></div>
                </div>
             )}
          </div>
        ))}
      </div>
    </>
  );

  const renderLabDetail = () => {
    if (!selectedLab) return null;
    return (
      <>
        <Header title={selectedLab.name} showBack={true} />
        <div className="px-6 pb-24 space-y-6">
           {selectedLab.logo && (
              <div className="flex justify-center my-4">
                 <img src={selectedLab.logo} alt="Logo" className="h-24 object-contain" />
              </div>
           )}
           
           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                 <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider ${
                    selectedLab.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                 }`}>{selectedLab.status}</span>
                 <span className="text-xs font-bold text-gray-400">{selectedLab.lastUpdated}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                 <div><FieldLabel>Volunteer Gender</FieldLabel><p className="font-medium dark:text-gray-200">{selectedLab.volunteerGender}</p></div>
                 <div><FieldLabel>Age Limit</FieldLabel><p className="font-medium dark:text-gray-200">{selectedLab.age}</p></div>
                 <div><FieldLabel>BMI Range</FieldLabel><p className="font-medium dark:text-gray-200">{selectedLab.bmi}</p></div>
                 <div><FieldLabel>Blood Loss</FieldLabel><p className="font-medium dark:text-gray-200">{selectedLab.lossMl}</p></div>
                 <div><FieldLabel>In-House Stay</FieldLabel><p className="font-medium dark:text-gray-200">{selectedLab.inHouse}</p></div>
                 <div><FieldLabel>Compensation</FieldLabel><p className="font-bold text-[#007DA5] dark:text-blue-400 text-lg">{selectedLab.amount}</p></div>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
               <FieldLabel>Requirements</FieldLabel>
               <p className="text-sm leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">{selectedLab.requirements || selectedLab.detail}</p>
           </div>
           
           <div className="bg-gradient-to-br from-[#1A005B] to-[#007DA5] p-6 rounded-3xl text-white shadow-lg">
               <h3 className="font-bold mb-4">{t.contact}</h3>
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white/20 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>
                     <span className="font-medium">{selectedLab.contact}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white/20 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></div>
                     <span className="font-medium">{selectedLab.phone}</span>
                  </div>
               </div>
               <div className="mt-6 flex gap-3">
                  <button onClick={() => window.open(`tel:${selectedLab.phone}`)} className="flex-1 bg-white text-[#1A005B] py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">{t.call}</button>
                  <button onClick={() => openGoogleMaps(selectedLab)} className="flex-1 bg-[#1A005B]/50 border border-white/20 text-white py-3 rounded-xl font-bold text-sm hover:bg-[#1A005B]/70 transition-colors">{t.directions}</button>
               </div>
           </div>
        </div>
      </>
    );
  };

  const renderNotifications = () => (
    <>
       <Header title={t.notifications} showBack={true} showNotification={false} />
       <div className="px-6 space-y-4">
          {notifications.length === 0 ? (
             <div className="text-center py-10 text-gray-400">{t.notifications} empty</div>
          ) : (
             notifications.map(n => (
               <div key={n.id} className={`p-4 rounded-2xl border transition-all ${n.isRead ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'}`}>
                  <div className="flex justify-between items-start mb-1">
                     <h4 className="font-bold text-[#1A005B] dark:text-blue-100">{n.title}</h4>
                     <span className="text-[10px] text-gray-400 font-bold">{n.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">{n.message}</p>
                  {!n.isRead && (
                    <button onClick={() => markNotificationAsRead(n.id)} className="text-xs font-bold text-[#007DA5] hover:underline">Mark as read</button>
                  )}
               </div>
             ))
          )}
       </div>
    </>
  );

  const renderClientDashboard = () => (
    <>
      <Header title={t.adminDashboard} showNotification={false} />
      <div className="px-6 mb-6">
         <Button fullWidth onClick={() => { setFormData({}); setScreen('ADD_HUB'); }}>+ {t.addHub}</Button>
      </div>
      <div className="px-6 pb-24 space-y-4">
         {labs.map(lab => (
           <div key={lab.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
               <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-[#1A005B] dark:text-blue-100">{lab.name}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-lg font-bold">{lab.status}</span>
               </div>
               <p className="text-xs text-gray-500 mb-4">{lab.detail}</p>
               <div className="flex gap-2">
                  <button onClick={() => { setFormData(lab); setScreen('ADD_HUB'); }} className="flex-1 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 text-xs font-bold text-[#1A005B] dark:text-blue-200 hover:bg-gray-100 dark:hover:bg-slate-700">Edit</button>
                  <button onClick={() => deleteLab(lab.id)} className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-xs font-bold text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30">Delete</button>
               </div>
           </div>
         ))}
      </div>
    </>
  );

  const renderAddHub = () => (
    <>
      <Header title={formData.id ? t.updateDetail : t.addHub} showBack={true} showNotification={false} />
      <div className="px-6 pb-24">
         <form onSubmit={updateLabData} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4">
             <div className="flex justify-center mb-6">
                <div className="relative">
                   <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-slate-600">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-xs font-bold">Logo</span>
                      )}
                   </div>
                   <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
             </div>
             
             <Input label={t.name} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
             <Input label="State" value={formData.state || ''} onChange={e => setFormData({...formData, state: e.target.value})} />
             <Input label="Status" value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value as any})} placeholder="Active/Pending/Completed" />
             <Input label="Amount" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: e.target.value})} />
             
             <div className="grid grid-cols-2 gap-4">
                <Input label="Contact Person" value={formData.contact || ''} onChange={e => setFormData({...formData, contact: e.target.value})} />
                <Input label="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
             </div>

             <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
                <h4 className="font-bold text-[#1A005B] dark:text-blue-200 mb-4">Clinical Parameters</h4>
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Volunteer Gender" value={formData.volunteerGender || ''} onChange={e => setFormData({...formData, volunteerGender: e.target.value})} />
                   <Input label="Age Range" value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} />
                   <Input label="BMI Range" value={formData.bmi || ''} onChange={e => setFormData({...formData, bmi: e.target.value})} />
                   <Input label="Blood Loss (mL)" value={formData.lossMl || ''} onChange={e => setFormData({...formData, lossMl: e.target.value})} />
                   <Input label="In-House Stay" value={formData.inHouse || ''} onChange={e => setFormData({...formData, inHouse: e.target.value})} />
                   <Input label="Period Count" value={formData.periodCount || ''} onChange={e => setFormData({...formData, periodCount: e.target.value})} />
                </div>
             </div>

             <div className="border-t border-gray-100 dark:border-slate-800 pt-4">
                <h4 className="font-bold text-[#1A005B] dark:text-blue-200 mb-4">Dates & Requirements</h4>
                <Input label="Screening Date" value={formData.screeningDate || ''} onChange={e => setFormData({...formData, screeningDate: e.target.value})} />
                <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requirements / Details</label>
                   <textarea 
                     className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-white"
                     rows={4}
                     value={formData.requirements || formData.detail || ''} 
                     onChange={e => setFormData({...formData, requirements: e.target.value, detail: e.target.value})} 
                   />
                </div>
             </div>

             <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl space-y-4">
                <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold">Security Verification</p>
                <Input 
                  label="Facility Password" 
                  type="password" 
                  value={facilityPassword} 
                  onChange={e => setFacilityPassword(e.target.value)} 
                  placeholder="Enter password to save"
                  required
                />
                {!formData.id && (
                  <Input 
                    label="Confirm Password" 
                    type="password" 
                    value={confirmFacilityPassword} 
                    onChange={e => setConfirmFacilityPassword(e.target.value)} 
                    placeholder="Confirm password"
                    required
                  />
                )}
             </div>

             <Button fullWidth type="submit">{t.submit}</Button>
         </form>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300 font-sans text-gray-800 dark:text-gray-100`}>
      {screen === 'SPLASH' && renderSplash()}
      {screen === 'LOGIN' && renderLogin()}
      {screen === 'SIGNUP' && renderSignup()}
      {screen === 'FORGOT_PASSWORD' && renderForgotPassword()}
      {screen === 'MAIN' && renderMain()}
      {screen === 'LAB_LIST' && renderLabList()}
      {screen === 'LAB_DETAIL' && renderLabDetail()}
      {screen === 'NOTIFICATIONS' && renderNotifications()}
      {screen === 'CLIENT_DASHBOARD' && renderClientDashboard()}
      {screen === 'ADD_HUB' && renderAddHub()}
    </div>
  );
};

export default App;