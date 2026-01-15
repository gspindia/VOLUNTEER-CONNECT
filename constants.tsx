
import { State, Lab, AppNotification, Language } from './types';

export const LOGO_URL = "https://raw.githubusercontent.com/Anand-Mishra-dev/Anand-Mishra-dev/refs/heads/main/volunteer-logo.png";

export const BRAND_COLORS = {
  deepBlue: "#1A005B",
  teal: "#007DA5",
  gradient: "linear-gradient(135deg, #1A005B 0%, #007DA5 100%)",
  radialGradient: "radial-gradient(circle at center, #007DA5 0%, #1A005B 100%)"
};

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'HI', label: 'हिंदी' },
  { code: 'MR', label: 'मराठी' },
  { code: 'GU', label: 'ગુજરાતી' },
  { code: 'TE', label: 'తెలుగు' },
  { code: 'TA', label: 'தமிழ்' },
  { code: 'KN', label: 'ಕನ್ನಡ' }
];

export const TRANSLATIONS: Record<Language, any> = {
  EN: {
    welcome: "Welcome Back",
    signIn: "Sign in to your account",
    login: "Login",
    signup: "Sign Up",
    forgotPass: "Forgot Password?",
    asVolunteer: "As Volunteer",
    asClient: "As Client",
    createAccount: "Create Identity",
    mobile: "Mobile Number",
    password: "Password",
    explore: "Explore by State",
    notifications: "Intelligence Feed",
    clientDashboard: "Management Dashboard",
    addHub: "Add Facility Hub",
    updateDetail: "Update Details"
  },
  HI: {
    welcome: "वापसी पर स्वागत है",
    signIn: "अपने खाते में साइन इन करें",
    login: "लॉगिन",
    signup: "साइन अप करें",
    forgotPass: "पासवर्ड भूल गए?",
    asVolunteer: "स्वयंसेवक के रूप में",
    asClient: "क्लाइंट के रूप में",
    createAccount: "पहचान बनाएं",
    mobile: "मोबाइल नंबर",
    password: "पासवर्ड",
    explore: "राज्य अनुसार खोजें",
    notifications: "सूचनाएं",
    clientDashboard: "प्रबंधन डैशबोर्ड",
    addHub: "सुविधा केंद्र जोड़ें",
    updateDetail: "विवरण अपडेट करें"
  },
  MR: {
    welcome: "पुन्हा स्वागत आहे",
    signIn: "आपल्या खात्यात साइन इन करा",
    login: "लॉगिन",
    signup: "साइन अप करा",
    forgotPass: "पासवर्ड विसरलात?",
    asVolunteer: "स्वयंसेवक म्हणून",
    asClient: "क्लाइंट म्हणून",
    createAccount: "ओळख निर्माण करा",
    mobile: "मोबाईल नंबर",
    password: "पासवर्ड",
    explore: "राज्यानुसार शोधा",
    notifications: "सूचना",
    clientDashboard: "व्यवस्थापन डॅशबोर्ड",
    addHub: "सुविधा केंद्र जोडा",
    updateDetail: "तपशील अपडेट करा"
  },
  GU: {
    welcome: "સ્વાગત છે",
    signIn: "તમારા ખાતામાં લોગ ઇન કરો",
    login: "લોગિન",
    signup: "સાઇન અપ કરો",
    forgotPass: "પાસવર્ડ ભૂલી ગયા છો?",
    asVolunteer: "સ્વયંસેવક તરીકે",
    asClient: "ક્લાયંટ તરીકે",
    createAccount: "ઓળખ બનાવો",
    mobile: "મોબાઈલ નંબર",
    password: "પાસવર્ડ",
    explore: "રાજ્ય મુજબ શોધો",
    notifications: "સૂચનાઓ",
    clientDashboard: "મેનેજમેન્ટ ડેશબોર્ડ",
    addHub: "સુવિધા કેન્દ્ર ઉમેરો",
    updateDetail: "વિગતો અપડેટ કરો"
  },
  TE: {
    welcome: "స్వాగతం",
    signIn: "మీ ఖాతాకు సైన్ ఇన్ చేయండి",
    login: "లాగిన్",
    signup: "సైన్ అప్",
    forgotPass: "పాస్‌వర్డ్ మర్చిపోయారా?",
    asVolunteer: "వాలంటీర్‌గా",
    asClient: "క్లయింట్‌గా",
    createAccount: "గుర్తింపును సృష్టించండి",
    mobile: "మొబైల్ నంబర్",
    password: "పాస్‌వర్డ్",
    explore: "రాష్ట్రం ప్రకారం అన్వేషించండి",
    notifications: "నోటిఫికేషన్లు",
    clientDashboard: "మేనేజ్‌మెంట్ డాష్‌బోర్డ్",
    addHub: "సౌకర్యాన్ని జోడించండి",
    updateDetail: "వివరాలను నవీకరించండి"
  },
  TA: {
    welcome: "வரவேற்கிறோம்",
    signIn: "உங்கள் கணக்கில் உள்நுழையவும்",
    login: "உள்நுழை",
    signup: "பதிவு செய்க",
    forgotPass: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    asVolunteer: "தன்னார்வலராக",
    asClient: "கிளையண்டாக",
    createAccount: "அடையாளத்தை உருவாக்கவும்",
    mobile: "கைபேசி எண்",
    password: "கடவுச்சொல்",
    explore: "மாநில வாரியாக ஆராயுங்கள்",
    notifications: "அறிவிப்புகள்",
    clientDashboard: "மேலாண்மை டாஷ்போர்டு",
    addHub: "வசதியைச் சேர்க்கவும்",
    updateDetail: "விவரங்களைப் புதுப்பிக்கவும்"
  },
  KN: {
    welcome: "ಸ್ವಾಗತ",
    signIn: "ನಿಮ್ಮ ಖಾತೆಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
    login: "ಲಾಗಿನ್",
    signup: "ಸೈನ್ ಅಪ್",
    forgotPass: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    asVolunteer: "ಸ್ವಯಂಸೇವಕರಾಗಿ",
    asClient: "ಕ್ಲೈಂಟ್ ಆಗಿ",
    createAccount: "ಗುರುತನ್ನು ರಚಿಸಿ",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    password: "ಪಾಸ್ವರ್ಡ್",
    explore: "ರಾಜ್ಯವಾರು ಅನ್ವೇಷಿಸಿ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    clientDashboard: "ನಿರ್ವಹಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    addHub: "ಸೌಲಭ್ಯವನ್ನು ಸೇರಿಸಿ",
    updateDetail: "ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ"
  }
};

export const STATES_LIST = [
  State.Maharashtra, State.Gujarat, State.Telangana, State.Karnataka,
  State.AndhraPradesh, State.TamilNadu, State.Delhi, State.Goa
];

export const MOCK_LABS: Lab[] = [
  {
    id: '1',
    name: 'Metropolis Health Lab',
    state: State.Maharashtra,
    status: 'Active',
    detail: 'Advanced pathology and molecular diagnostics center located in Mumbai.',
    report: 'Weekly health screening report - Week 42',
    contact: 'Dr. Sameer Khan',
    phone: '+91 9876543210'
  },
  {
    id: '2',
    name: 'Apollo Diagnostics',
    state: State.Maharashtra,
    status: 'Pending',
    detail: 'Primary care diagnostic facility with radiology services.',
    report: 'Inventory status report',
    contact: 'Anjali Sharma',
    phone: '+91 9876543211'
  },
  {
    id: '3',
    name: 'Precision Labs',
    state: State.Gujarat,
    status: 'Completed',
    detail: 'Specialized testing lab for industrial safety and health.',
    report: 'Annual safety audit 2024',
    contact: 'Vikas Patel',
    phone: '+91 9876543212'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Status Updated',
    message: 'Metropolis Health Lab is now marked as Active.',
    timestamp: '2 mins ago',
    type: 'status_change',
    isRead: false
  },
  {
    id: 'n2',
    title: 'New Report Available',
    message: 'Weekly health screening report uploaded for Sunrise Clinical Lab.',
    timestamp: '1 hour ago',
    type: 'report_added',
    isRead: false
  }
];
