
export enum UserRole {
  ADMIN = 'ADMIN',
  WARDEN = 'WARDEN',
  KITCHEN = 'KITCHEN',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  studentId: string;
  roomNumber?: string;
  contactNumber: string;
  emergencyContact: string;
  cnic: string;
  address: string;
  purposeOfStay: string;
  isCheckedIn: boolean; // Track if student is inside hostel
}

export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  occupants: string[]; // Student IDs
  floor: number;
  type: '1-bed' | '2-bed' | '4-bed';
}

export enum ComplaintStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  category: 'Plumbing' | 'Electricity' | 'Cleaning' | 'Internet' | 'Other';
  description: string;
  date: string;
  status: ComplaintStatus;
}

export interface MealItem {
  id: string;
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  description: string;
  available: boolean;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready',
  COLLECTED = 'Collected'
}

export interface MealOrder {
  id: string;
  studentId: string;
  studentName: string;
  items: string[];
  date: string;
  pickupTime: string;
  status: OrderStatus;
  specialInstructions?: string;
  qrCode?: string;
}

// --- New Features ---

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetRole: UserRole[];
}

export interface MovementLog {
  id: string;
  studentId: string;
  studentName: string;
  type: 'CHECK_IN' | 'CHECK_OUT';
  reason?: string;
  timestamp: string;
}

export enum FeeStatus {
  PENDING = 'Pending',
  SUBMITTED = 'Submitted', // Student uploaded proof
  PAID = 'Paid',
  OVERDUE = 'Overdue'
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  month: string;
  status: FeeStatus;
  submissionDate?: string;
  transactionId?: string; // Text based ID instead of image
}

export interface DailyMenu {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface WeeklyMenu {
  Monday: DailyMenu;
  Tuesday: DailyMenu;
  Wednesday: DailyMenu;
  Thursday: DailyMenu;
  Friday: DailyMenu;
  Saturday: DailyMenu;
  Sunday: DailyMenu;
}
