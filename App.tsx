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

  const Header = ({ title, showBack = false, showLang = true, showNotification = true }) => (
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
           {/* Theme Toggle */}
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
        <div className="w-8"></div> {/* Spacer */}
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
            
            <button 
              onClick={() => setScreen('LOGIN')}
              className="w-full py-3 text-sm font-bold text-gray-400 hover:text-[#1A005B] dark:hover:text-blue-200 transition-colors"
            >
              {t.backToLogin}
            </button>
         </div>
      </div>
       <div className="mt-auto pt-4 flex justify-center">
        <LanguageSelector direction="up" />
      </div>
    </div>
  );

  const renderMain = () => (
    <>
      <Header 
        title={`${getGreeting()},\n${user?.name.split(' ')[0]}`} 
        showBack={false}
      />
      <div className="px-6 pb-24 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
        <div className="mb-6 bg-gradient-to-br from-[#1A005B] to-[#007DA5] p-6 rounded-[2rem] text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-1">Your Identity</p>
            <h3 className="text-2xl font-bold mb-4">{user?.volNo}</h3>
            <div className="flex items-center space-x-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Active Volunteer</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#1A005B] dark:text-blue-200 mb-4 flex items-center">
          <span className="w-1 h-6 bg-[#007DA5] rounded-full mr-3"></span>
          {t.explore}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {STATES_LIST.map((state) => (
            <button
              key={state}
              onClick={() => {
                setSelectedState(state);
                setScreen('LAB_LIST');
              }}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-800 text-[#007DA5] dark:text-blue-400 flex items-center justify-center mb-3 group-hover:bg-[#007DA5] group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100 text-sm">{state}</h4>
              <p className="text-xs text-gray-400 mt-1">{labs.filter(l => l.state === state).length} {t.facilities}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const StatusDetailRow = ({ label, value }: { label: string, value?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-start mb-1 text-sm">
         <span className="text-gray-300 dark:text-gray-600 mr-2 font-bold">➔</span>
         <span className="font-bold text-gray-600 dark:text-gray-400 w-24 shrink-0">{label}</span>
         <span className="text-gray-300 dark:text-gray-600 mx-2 font-bold">-</span>
         <span className="font-bold text-[#007DA5] dark:text-blue-400 flex-1">{value}</span>
      </div>
    );
  };

  const renderLabList = () => {
    const filteredLabs = labs.filter(l => l.state === selectedState);
    
    return (
      <>
        <Header 
          title={`${selectedState}\n${t.facilities}`}
          showBack={true}
        />
        <div className="px-6 pb-6">
          <div className="flex p-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl mb-6 shadow-sm transition-colors">
            <button 
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeListTab === 'STATUS' ? 'bg-[#1A005B] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              onClick={() => setActiveListTab('STATUS')}
            >
              {t.liveStatus}
            </button>
            <button 
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeListTab === 'DETAILS' ? 'bg-[#1A005B] text-white shadow-md' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              onClick={() => setActiveListTab('DETAILS')}
            >
              {t.allDetails}
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto h-[calc(100vh-220px)] custom-scrollbar pb-10">
            {filteredLabs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>No facilities found in this region.</p>
              </div>
            ) : (
              activeListTab === 'STATUS' ? (
                // Detailed Card View for Live Status Tab - THEMED BACK TO ORIGINAL
                filteredLabs.map(lab => (
                  <div key={lab.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 border-b border-gray-50 dark:border-slate-800 pb-2">
                        <div className="flex-1">
                          <h3 className="text-[#1A005B] dark:text-blue-200 font-black text-lg uppercase tracking-tight">{lab.name}</h3>
                          <span className="text-[#007DA5] dark:text-blue-300 font-bold text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">{lab.lastUpdated ? lab.lastUpdated.split(' ')[0] : '15-01-2026'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={(e) => {
                               e.stopPropagation();
                               openGoogleMaps(lab);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 text-[#007DA5] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 shadow-sm transition-colors active:scale-95"
                          >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          </button>
                          
                          <button 
                            onClick={(e) => {
                               e.stopPropagation();
                               window.location.href = `tel:${lab.phone || ''}`;
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 shadow-sm transition-colors active:scale-95"
                          >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          </button>
                        </div>
                    </div>
                    
                    {/* Body */}
                    <div className="space-y-1">
                      <StatusDetailRow label="Volunteers" value={lab.volunteerGender} />
                      <StatusDetailRow label="In House" value={lab.inHouse} />
                      <StatusDetailRow label="Periods" value={lab.periodCount} />
                      <StatusDetailRow label="Condition" value={lab.condition} />
                      <StatusDetailRow label="Loss" value={lab.lossMl} />
                      <StatusDetailRow label="Ambulatory" value={lab.ambulatory} />
                      <StatusDetailRow label="BMI" value={lab.bmi} />
                      <StatusDetailRow label="Age" value={lab.age} />
                    </div>
                    
                    {/* Amount */}
                    <div className="flex items-center bg-[#1A005B]/5 dark:bg-blue-900/20 border border-[#1A005B]/10 dark:border-blue-700/30 rounded-xl px-3 py-2 my-3">
                        <span className="text-gray-400 dark:text-gray-500 mr-2 font-bold">➔</span>
                        <span className="font-bold text-[#1A005B] dark:text-blue-200 w-24 shrink-0">{t.amount}</span>
                         <span className="mx-2"></span>
                        <div className="flex items-center text-[#007DA5] dark:text-blue-400 font-black uppercase text-sm">
                            {lab.amount || 'N/A'}
                        </div>
                    </div>

                    {/* Periods List */}
                    <div className="space-y-1 mb-4">
                      <StatusDetailRow label="1st Period" value={lab.period1} />
                      <StatusDetailRow label="2nd Period" value={lab.period2} />
                      <StatusDetailRow label="3rd Period" value={lab.period3} />
                      <StatusDetailRow label="4th Period" value={lab.period4} />
                    </div>

                    {/* Description / Notes */}
                    <div className="pt-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30 -mx-5 -mb-5 p-5">
                         <p className="text-gray-600 dark:text-gray-400 font-medium text-sm whitespace-pre-line leading-relaxed">
                            {lab.requirements}
                         </p>
                    </div>

                  </div>
                ))
              ) : (
                // Standard Detail List Item (Summary)
                filteredLabs.map(lab => (
                  <div 
                    key={lab.id} 
                    onClick={() => { setSelectedLabId(lab.id); setScreen('LAB_DETAIL'); }}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-4">
                      {/* Logo Placeholder */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border border-indigo-100 dark:border-slate-600 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow overflow-hidden">
                        {lab.logo ? (
                            <img src={lab.logo} alt={lab.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl font-black text-[#1A005B] dark:text-blue-200 opacity-40">{lab.name.charAt(0)}</span>
                        )}
                      </div>

                      {/* Content Container */}
                      <div className="flex-1 min-w-0 pt-0.5 relative">
                        <div className="flex justify-between items-start mb-1 pr-24">
                          <h3 className="font-bold text-[#1A005B] dark:text-blue-100 text-base leading-tight group-hover:text-[#007DA5] dark:group-hover:text-blue-300 transition-colors truncate pr-2">{lab.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${
                            lab.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            lab.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          }`}>
                            {lab.status}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="absolute right-0 top-6 flex space-x-2 z-10">
                           <button 
                            onClick={(e) => {
                               e.stopPropagation();
                               openGoogleMaps(lab);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800 text-[#007DA5] dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-all shadow-sm"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          </button>
                           <button 
                            onClick={(e) => {
                               e.stopPropagation();
                               window.location.href = `tel:${lab.phone || ''}`;
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 transition-all shadow-sm"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          </button>
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3 font-medium mr-16">{lab.detail}</p>
                        
                        <div className="flex justify-between items-center border-t border-gray-50 dark:border-slate-800 pt-2">
                          <div className="flex items-center text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {lab.address ? `${lab.address}, ${lab.state}` : lab.state}
                          </div>
                          <span className="text-[10px] font-bold text-[#007DA5] dark:text-blue-400 group-hover:translate-x-1 transition-transform flex items-center uppercase tracking-wide">
                            {t.view} <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </>
    );
  };

  const renderLabDetail = () => {
    if (!selectedLab) return null;

    return (
      <>
        <Header 
          title={selectedLab.name}
          showBack={true}
        />
        <div className="px-6 pb-24 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
            
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-lg flex items-center justify-center overflow-hidden mb-4">
                     {selectedLab.logo ? (
                         <img src={selectedLab.logo} alt={selectedLab.name} className="w-full h-full object-cover" />
                     ) : (
                         <span className="text-3xl font-black text-[#1A005B] dark:text-blue-200 opacity-40">{selectedLab.name.charAt(0)}</span>
                     )}
                </div>
                <h2 className="text-xl font-black text-[#1A005B] dark:text-blue-100 text-center mb-1">{selectedLab.name}</h2>
                <div className="flex items-center space-x-2">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        selectedLab.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        selectedLab.status === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {selectedLab.status}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600 text-xs">•</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedLab.address ? `${selectedLab.address}, ` : ''}{selectedLab.state}
                      </span>
                </div>
            </div>

            <div className="space-y-6">
               <div>
                  <FieldLabel>About Facility</FieldLabel>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{selectedLab.detail}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <FieldLabel>Contact Person</FieldLabel>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{selectedLab.contact || 'N/A'}</p>
                 </div>
                 <div>
                    <FieldLabel>Phone</FieldLabel>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{selectedLab.phone || 'N/A'}</p>
                 </div>
               </div>
               
               {/* Detailed Stats */}
               <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-800">
                  <div className="space-y-2">
                      <StatusDetailRow label="Volunteers" value={selectedLab.volunteerGender} />
                      <StatusDetailRow label="Compensation" value={selectedLab.amount} />
                      <StatusDetailRow label="Age Group" value={selectedLab.age} />
                  </div>
               </div>

               <div>
                 <FieldLabel>Screening Details</FieldLabel>
                 <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><span className="font-bold">Date:</span> {selectedLab.screeningDate || 'Contact for details'}</p>
                    <p><span className="font-bold">Time:</span> {selectedLab.screeningTime || 'Contact for details'}</p>
                 </div>
               </div>
               
               <div>
                 <FieldLabel>Requirements & Notes</FieldLabel>
                 <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line bg-blue-50 dark:bg-slate-800/50 p-3 rounded-lg border border-blue-100 dark:border-slate-800">
                   {selectedLab.requirements || 'No specific requirements listed.'}
                 </p>
               </div>

               <div className="flex gap-3 pt-2">
                 <Button 
                   fullWidth 
                   onClick={() => window.location.href = `tel:${selectedLab.phone}`}
                   className="flex-1"
                 >
                    {t.call}
                 </Button>
                 <Button 
                    fullWidth 
                    variant="outline" 
                    onClick={() => openGoogleMaps(selectedLab)}
                    className="flex-1"
                 >
                    {t.directions}
                 </Button>
               </div>
            </div>

          </div>
        </div>
      </>
    );
  };

  const renderNotifications = () => (
    <>
      <Header title={t.notifications} showBack={true} showNotification={false} />
      <div className="px-6 pb-24 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
        {notifications.length === 0 ? (
           <div className="text-center py-12 text-gray-400">
             <p>No new notifications</p>
           </div>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                onClick={() => markNotificationAsRead(notification.id)}
                className={`p-4 rounded-2xl border transition-all ${
                  notification.isRead 
                  ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 opacity-70' 
                  : 'bg-white dark:bg-slate-900 border-[#007DA5]/20 shadow-sm border-l-4 border-l-[#007DA5]'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-[#1A005B] dark:text-blue-200'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-medium">{notification.timestamp}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{notification.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderClientDashboard = () => (
    <>
      <Header title={t.adminDashboard} showNotification={false} />
      <div className="px-6 pb-24">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold text-[#1A005B] dark:text-blue-200">Managed {t.facilities}</h3>
           <button onClick={() => { setFormData({}); setFacilityPassword(''); setConfirmFacilityPassword(''); setScreen('ADD_HUB'); }} className="p-2 bg-[#1A005B] text-white rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
           </button>
        </div>

        <div className="space-y-4">
          {labs.map(lab => (
            <div key={lab.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-[#1A005B] dark:text-blue-200">{lab.name}</h4>
                  <p className="text-xs text-gray-400">
                    {lab.state} 
                    {lab.lastUpdated && <span className="text-gray-300 mx-1">•</span>}
                    {lab.lastUpdated && <span className="text-[10px] text-green-600 font-medium">{lab.lastUpdated}</span>}
                  </p>
                </div>
                <button onClick={() => { setFormData(lab); setFacilityPassword(''); setConfirmFacilityPassword(''); setScreen('ADD_HUB'); }} className="text-[#007DA5] dark:text-blue-400 text-xs font-bold px-3 py-1 bg-blue-50 dark:bg-slate-800 rounded-lg hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors">
                  {t.updateDetail}
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 border-t border-gray-50 dark:border-slate-800 pt-3">
                 <div className="text-center">
                    <span className="block text-[10px] text-gray-400 uppercase">BMI</span>
                    <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{lab.bmi || '-'}</span>
                 </div>
                 <div className="text-center border-l border-gray-100 dark:border-slate-800">
                    <span className="block text-[10px] text-gray-400 uppercase">Age</span>
                    <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{lab.age || '-'}</span>
                 </div>
                 <div className="text-center border-l border-gray-100 dark:border-slate-800">
                    <span className="block text-[10px] text-gray-400 uppercase">Loss</span>
                    <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{lab.lossMl || '-'}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderAddHub = () => (
    <>
      <Header title={formData.id ? t.updateDetail : t.addHub} showBack={true} showLang={false} showNotification={false} />
      <div className="px-6 pb-24 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar">
        <form onSubmit={updateLabData} className="space-y-5">
           <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
             <h3 className="text-sm font-bold text-[#1A005B] dark:text-blue-200 mb-2 border-b dark:border-slate-800 pb-2">Basic Information</h3>
             
             {/* LOGO UPLOAD SECTION */}
             <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-700 flex items-center justify-center overflow-hidden relative group">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-xs text-center p-2 font-medium">No Logo</span>
                  )}
                </div>
                <div className="flex-1">
                   <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Facility Logo</label>
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleLogoChange}
                     className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#007DA5]/10 file:text-[#007DA5] hover:file:bg-[#007DA5]/20 dark:file:bg-blue-900/20 dark:file:text-blue-300 transition-all cursor-pointer"
                   />
                   <p className="text-[10px] text-gray-400 mt-1">Upload a square image for best results.</p>
                </div>
             </div>

             <Input label="Facility Name" defaultValue={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             
             {/* State Dropdown */}
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location State</label>
                <div className="relative">
                  <select
                    value={formData.state || State.Maharashtra}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-800 dark:text-white appearance-none"
                  >
                    {STATES_LIST.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
             </div>

             {/* New City/Address Input */}
             <Input label="City / Area" defaultValue={formData.address} placeholder="e.g. Andheri West, Mumbai" onChange={e => setFormData({...formData, address: e.target.value})} />

             <Input label="Status Report" defaultValue={formData.report} onChange={e => setFormData({...formData, report: e.target.value})} />
             <Input label="Clinical Notes" defaultValue={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} />
             
             {/* NEW CONTACT INPUTS */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-dashed dark:border-slate-700">
                <Input label="Contact Person Name" defaultValue={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                <Input label="Contact Phone Number" defaultValue={formData.phone} type="tel" onChange={e => setFormData({...formData, phone: e.target.value})} />
             </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
             <h3 className="text-sm font-bold text-[#1A005B] dark:text-blue-200 mb-2 border-b dark:border-slate-800 pb-2">Study Parameters</h3>
             <div className="grid grid-cols-2 gap-4">
               <Input label="Volunteers (Gender)" defaultValue={formData.volunteerGender} placeholder="e.g. Male Only" onChange={e => setFormData({...formData, volunteerGender: e.target.value})} />
               <Input label="In House (Duration)" defaultValue={formData.inHouse} placeholder="e.g. 72 Hours" onChange={e => setFormData({...formData, inHouse: e.target.value})} />
               <Input label="Period Count" defaultValue={formData.periodCount} placeholder="e.g. 3" onChange={e => setFormData({...formData, periodCount: e.target.value})} />
               <Input label="Condition" defaultValue={formData.condition} placeholder="e.g. Fasting/Fed" onChange={e => setFormData({...formData, condition: e.target.value})} />
               <Input label="Blood Loss" defaultValue={formData.lossMl} placeholder="e.g. 357 mL" onChange={e => setFormData({...formData, lossMl: e.target.value})} />
               <Input label="Ambulatory" defaultValue={formData.ambulatory} placeholder="e.g. No" onChange={e => setFormData({...formData, ambulatory: e.target.value})} />
             </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
             <h3 className="text-sm font-bold text-[#1A005B] dark:text-blue-200 mb-2 border-b dark:border-slate-800 pb-2">Eligibility & Compensation</h3>
             <div className="grid grid-cols-2 gap-4">
                <Input label="BMI Range" type="text" defaultValue={formData.bmi} placeholder="e.g. 19.5 to 30" onChange={e => setFormData({...formData, bmi: e.target.value})} />
                <Input label="Age Range" defaultValue={formData.age} placeholder="e.g. 18 to 44" onChange={e => setFormData({...formData, age: e.target.value})} />
             </div>
             {/* Use the new prefix prop for Rupee Symbol */}
             <Input 
                label="Compensation Amount" 
                defaultValue={formData.amount?.replace('₹ ', '')} 
                prefix="₹"
                placeholder="15,000" 
                onChange={e => setFormData({...formData, amount: `₹ ${e.target.value}`})} 
             />
           </div>

           <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
             <h3 className="text-sm font-bold text-[#1A005B] dark:text-blue-200 mb-2 border-b dark:border-slate-800 pb-2">Schedule & Dates</h3>
             <div className="grid grid-cols-2 gap-4">
               <Input label="Period 1" type="text" defaultValue={formData.period1} placeholder="DD-MM-YYYY" onChange={e => setFormData({...formData, period1: e.target.value})} />
               <Input label="Period 2" type="text" defaultValue={formData.period2} placeholder="DD-MM-YYYY" onChange={e => setFormData({...formData, period2: e.target.value})} />
               <Input label="Period 3" type="text" defaultValue={formData.period3} placeholder="DD-MM-YYYY" onChange={e => setFormData({...formData, period3: e.target.value})} />
               <Input label="Period 4" type="text" defaultValue={formData.period4} placeholder="DD-MM-YYYY" onChange={e => setFormData({...formData, period4: e.target.value})} />
             </div>
             <Input label="Screening Date" defaultValue={formData.screeningDate} placeholder="e.g. 16/01/2026 to 19/01/2026" onChange={e => setFormData({...formData, screeningDate: e.target.value})} />
             <Input label="Screening Time" defaultValue={formData.screeningTime} placeholder="e.g. 07:30 to 10:30" onChange={e => setFormData({...formData, screeningTime: e.target.value})} />
           </div>

           <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
              <h3 className="text-sm font-bold text-[#1A005B] dark:text-blue-200 mb-2 border-b dark:border-slate-800 pb-2">Requirements & Notes</h3>
              <textarea 
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-800 dark:text-white placeholder:text-gray-400 h-32"
                placeholder="Enter document requirements and other notes..."
                defaultValue={formData.requirements}
                onChange={e => setFormData({...formData, requirements: e.target.value})}
              />
           </div>

           {/* PASSWORD SECTION */}
           <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 space-y-4 transition-colors">
             <h3 className="text-sm font-bold text-[#1A005B] dark:text-blue-200 mb-2 border-b dark:border-slate-800 pb-2">Security</h3>
             
             {!formData.id ? (
               <div className="space-y-4">
                 <Input 
                   label="Set Facility Password" 
                   type="password" 
                   value={facilityPassword}
                   onChange={e => setFacilityPassword(e.target.value)}
                   placeholder="Create a password to secure this facility"
                 />
                 <Input 
                   label="Confirm Password" 
                   type="password" 
                   value={confirmFacilityPassword}
                   onChange={e => setConfirmFacilityPassword(e.target.value)}
                   placeholder="Re-enter password"
                 />
                 <p className="text-xs text-gray-400">You will need this password to update or delete this facility in the future.</p>
               </div>
             ) : (
               <div>
                  <Input 
                    label="Enter Facility Password to Save/Delete" 
                    type="password" 
                    value={facilityPassword}
                    onChange={e => setFacilityPassword(e.target.value)}
                    placeholder="Required for any changes"
                  />
                  <p className="text-xs text-yellow-600 dark:text-yellow-500 font-medium">Authentication required to verify updates.</p>
               </div>
             )}
           </div>
           
           <div className="flex flex-col gap-3">
             <Button fullWidth type="submit" size="lg">
               {formData.id ? 'Verify & Save Updates' : 'Create Facility'}
             </Button>
             
             {formData.id && (
               <Button 
                 type="button" 
                 variant="danger" 
                 fullWidth 
                 onClick={() => deleteLab(formData.id!)}
               >
                 Verify & Delete Facility
               </Button>
             )}
           </div>
        </form>
      </div>
    </>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8fafc] dark:bg-slate-950 shadow-2xl overflow-hidden relative font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
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