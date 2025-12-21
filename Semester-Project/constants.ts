import { UserRole, Student, Room, Complaint, MealItem, MealOrder, Notice, ComplaintStatus, OrderStatus } from './types';

// Default password for all mock users is 'password123'
export const MOCK_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@hostel.com', password: 'password123', role: UserRole.ADMIN, avatar: 'https://picsum.photos/100/100' },
  { id: 'u2', name: 'Warden Smith', email: 'warden@hostel.com', password: 'password123', role: UserRole.WARDEN, avatar: 'https://picsum.photos/101/101' },
  { id: 'u3', name: 'Chef Gordon', email: 'kitchen@hostel.com', password: 'password123', role: UserRole.KITCHEN, avatar: 'https://picsum.photos/102/102' },
  { 
    id: 's1', 
    name: 'John Doe', 
    email: 'student@hostel.com', 
    password: 'password123',
    role: UserRole.STUDENT, 
    studentId: 'ST-2024-001', 
    roomNumber: '101', 
    contactNumber: '555-0101', 
    emergencyContact: '555-9999', 
    cnic: '12345-6789012-3',
    address: '123 Main St, Cityville',
    purposeOfStay: 'Bachelor in Computer Science',
    avatar: 'https://picsum.photos/103/103' 
  },
  { 
    id: 's2', 
    name: 'Jane Roe', 
    email: 'jane@hostel.com', 
    password: 'password123',
    role: UserRole.STUDENT, 
    studentId: 'ST-2024-002', 
    roomNumber: '102', 
    contactNumber: '555-0102', 
    emergencyContact: '555-9998', 
    cnic: '98765-4321098-7',
    address: '456 Elm St, Townsville',
    purposeOfStay: 'Master in Physics',
    avatar: 'https://picsum.photos/104/104' 
  },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'r1', roomNumber: '101', capacity: 2, occupants: ['s1'], floor: 1, type: '2-bed' },
  { id: 'r2', roomNumber: '102', capacity: 2, occupants: ['s2'], floor: 1, type: '2-bed' },
  { id: 'r3', roomNumber: '103', capacity: 1, occupants: [], floor: 1, type: '1-bed' },
  { id: 'r4', roomNumber: '201', capacity: 4, occupants: [], floor: 2, type: '4-bed' },
  { id: 'r5', roomNumber: '202', capacity: 4, occupants: [], floor: 2, type: '4-bed' },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  { id: 'c1', studentId: 's1', studentName: 'John Doe', category: 'Plumbing', description: 'Leaking tap in bathroom 101', date: '2024-05-20', status: ComplaintStatus.PENDING },
  { id: 'c2', studentId: 's2', studentName: 'Jane Roe', category: 'Internet', description: 'WiFi signal weak on 1st floor', date: '2024-05-19', status: ComplaintStatus.RESOLVED },
];

export const MOCK_MENU: MealItem[] = [
  { id: 'm1', name: 'Pancakes & Eggs', type: 'Breakfast', description: 'Fluffy pancakes with scrambled eggs', available: true },
  { id: 'm2', name: 'Oatmeal & Fruits', type: 'Breakfast', description: 'Healthy oats with seasonal fruits', available: true },
  { id: 'm3', name: 'Grilled Chicken', type: 'Lunch', description: 'Served with rice and veggies', available: true },
  { id: 'm4', name: 'Veggie Curry', type: 'Dinner', description: 'Spicy mixed vegetable curry with naan', available: true },
];

export const MOCK_ORDERS: MealOrder[] = [
  { id: 'o1', studentId: 's1', studentName: 'John Doe', items: ['m1'], date: '2024-05-21', pickupTime: '08:30', status: OrderStatus.READY, qrCode: 'mock-qr-1' },
  { id: 'o2', studentId: 's2', studentName: 'Jane Roe', items: ['m2'], date: '2024-05-21', pickupTime: '09:00', status: OrderStatus.PENDING, qrCode: 'mock-qr-2' },
];

export const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'Summer Maintenance', content: 'The hostel will undergo maintenance from June 1st to June 5th.', date: '2024-05-15', author: 'Warden Smith' },
  { id: 'n2', title: 'Mess Timings Changed', content: 'Breakfast will now be served from 7:00 AM to 9:30 AM.', date: '2024-05-18', author: 'Admin User' },
];