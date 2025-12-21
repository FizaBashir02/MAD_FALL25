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
  password?: string; // Added for auth
  role: UserRole;
  avatar?: string;
}

export interface Student extends User {
  role: UserRole.STUDENT;
  studentId: string;
  roomNumber?: string;
  contactNumber: string;
  emergencyContact: string;
  cnic: string;          // New field
  address: string;       // New field
  purposeOfStay: string; // New field
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
  items: string[]; // MealItem IDs
  date: string;
  pickupTime: string;
  status: OrderStatus;
  specialInstructions?: string;
  qrCode?: string; // Mock QR string
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}