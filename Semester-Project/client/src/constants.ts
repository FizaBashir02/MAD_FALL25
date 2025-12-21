
import { UserRole, Room, Complaint, MealItem, MealOrder } from './types';

// Default password for mock users is 'password123'
// We only keep Admin/Warden/Kitchen for login access.
// All Student data is removed as requested.
export const MOCK_USERS = [
  { id: 'u1', name: 'Admin User', email: 'admin@hostel.com', password: 'password123', role: UserRole.ADMIN, avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff' },
  { id: 'u2', name: 'Warden Smith', email: 'warden@hostel.com', password: 'password123', role: UserRole.WARDEN, avatar: 'https://ui-avatars.com/api/?name=Warden&background=random' },
  { id: 'u3', name: 'Chef Gordon', email: 'kitchen@hostel.com', password: 'password123', role: UserRole.KITCHEN, avatar: 'https://ui-avatars.com/api/?name=Chef&background=random' },
];

export const MOCK_ROOMS: Room[] = [];
export const MOCK_COMPLAINTS: Complaint[] = [];
export const MOCK_ORDERS: MealOrder[] = [];

// Keep a basic menu structure for functionality
export const MOCK_MENU: MealItem[] = [
  { id: 'm1', name: 'Pancakes & Eggs', type: 'Breakfast', description: 'Fluffy pancakes with scrambled eggs', available: true },
  { id: 'm2', name: 'Oatmeal & Fruits', type: 'Breakfast', description: 'Healthy oats with seasonal fruits', available: true },
  { id: 'm3', name: 'Grilled Chicken', type: 'Lunch', description: 'Served with rice and veggies', available: true },
  { id: 'm4', name: 'Veggie Curry', type: 'Dinner', description: 'Spicy mixed vegetable curry with naan', available: true },
];
