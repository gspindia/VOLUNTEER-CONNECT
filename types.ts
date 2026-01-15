export type Screen = 'SPLASH' | 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'MAIN' | 'LAB_LIST' | 'LAB_DETAIL' | 'NOTIFICATIONS' | 'CLIENT_DASHBOARD' | 'ADD_HUB';

export type Role = 'VOLUNTEER' | 'CLIENT';

export type Language = 'EN' | 'HI' | 'MR' | 'TE' | 'TA' | 'KN' | 'GU';

export interface Lab {
  id: string;
  name: string;
  state: string;
  status: 'Active' | 'Pending' | 'Completed';
  detail: string;
  report: string;
  contact: string;
  phone: string;
  logo?: string;
  // Clinical/Operational Parameters
  volunteerGender?: string;
  periodCount?: string;
  inHouse?: string;
  condition?: string;
  lossMl?: string;
  ambulatory?: string;
  bmi?: string;
  age?: string;
  amount?: string;
  period1?: string;
  period2?: string;
  period3?: string;
  period4?: string;
  // New fields for detailed view
  screeningDate?: string;
  screeningTime?: string;
  requirements?: string;
  lastUpdated?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'status_change' | 'report_added' | 'alert';
  isRead: boolean;
}

export interface User {
  name: string;
  email: string;
  mobile: string;
  volNo: string;
  state: string;
  role: Role;
}

export enum State {
  Maharashtra = 'Maharashtra',
  Gujarat = 'Gujarat',
  Telangana = 'Telangana',
  Karnataka = 'Karnataka',
  AndhraPradesh = 'Andhra Pradesh',
  TamilNadu = 'Tamil Nadu',
  Delhi = 'Delhi',
  Goa = 'Goa'
}