
import { User, Room, Complaint, MealOrder, Student, UserRole, OrderStatus, ComplaintStatus } from '../types';
import { MOCK_USERS, MOCK_ROOMS, MOCK_COMPLAINTS, MOCK_ORDERS } from '../constants';

// --- Configuration ---
const API_URL = 'http://localhost:5000/api';
// In a real deployment, we wouldn't keep the mock fallback enabled by default if we expect a backend,
// but for this demo environment where the backend file exists but isn't running, we keep it true.
const USE_MOCK_FALLBACK = true;

// --- Mock Data State (Fallback) ---
let users: any[] = [...MOCK_USERS];
let rooms = [...MOCK_ROOMS];
let complaints = [...MOCK_COMPLAINTS];
let orders = [...MOCK_ORDERS];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Helpers ---

// Normalize MongoDB _id to frontend id
const normalizeId = (item: any) => {
  if (item && item._id) {
    const { _id, ...rest } = item;
    return { id: _id, ...rest };
  }
  return item;
};

// Generic Fetch Wrapper with Fallback
async function fetchWithFallback<T>(
  endpoint: string,
  options: RequestInit | undefined,
  mockFn: () => Promise<T>
): Promise<T> {
  // Try to hit the backend
  try {
    // We set a short timeout to fail fast if backend is not running
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data.map(normalizeId) : normalizeId(data);
    }
  } catch (error) {
    // console.warn(`Backend at ${endpoint} unreachable, using mock data.`);
  }

  // Fallback to mock data
  if (USE_MOCK_FALLBACK) {
    return mockFn();
  }
  
  throw new Error("API Unavailable");
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      return fetchWithFallback(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) },
        async () => {
          await delay(500);
          const user = users.find(u => u.email === email && u.password === password);
          if (!user) throw new Error("Invalid credentials");
          return user;
        }
      );
    }
  },
  
  students: {
    getAll: async (): Promise<Student[]> => {
      return fetchWithFallback(
        '/students',
        undefined,
        async () => {
          await delay(300);
          return users.filter(u => u.role === UserRole.STUDENT) as unknown as Student[];
        }
      );
    },
    create: async (studentData: Omit<Student, 'id' | 'role' | 'avatar' | 'password'>): Promise<Student> => {
      return fetchWithFallback(
        '/students',
        { method: 'POST', body: JSON.stringify(studentData) },
        async () => {
          await delay(300);
          const newStudent: any = {
            ...studentData,
            id: `s${Date.now()}`,
            role: UserRole.STUDENT,
            password: 'password123',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=random&color=fff&background=2563eb`
          };
          users.push(newStudent);
          return newStudent;
        }
      );
    }
  },

  rooms: {
    getAll: async (): Promise<Room[]> => {
      return fetchWithFallback(
        '/rooms',
        undefined,
        async () => {
          await delay(300);
          return [...rooms];
        }
      );
    },
    create: async (roomData: Omit<Room, 'id' | 'occupants'>): Promise<Room> => {
      return fetchWithFallback(
        '/rooms',
        { method: 'POST', body: JSON.stringify(roomData) },
        async () => {
          await delay(300);
          const newRoom: Room = { ...roomData, id: `r${Date.now()}`, occupants: [] };
          rooms.push(newRoom);
          return newRoom;
        }
      );
    },
    assign: async (roomId: string, studentId: string): Promise<void> => {
      return fetchWithFallback(
        '/rooms/assign',
        { method: 'POST', body: JSON.stringify({ roomId, studentId }) },
        async () => {
          await delay(300);
          // Remove from old room
          rooms = rooms.map(r => ({
            ...r,
            occupants: r.occupants.filter(id => id !== studentId)
          }));
          // Add to new room
          rooms = rooms.map(r => {
            if (r.id === roomId && !r.occupants.includes(studentId)) {
              return { ...r, occupants: [...r.occupants, studentId] };
            }
            return r;
          });
          // Update student record
          const room = rooms.find(r => r.id === roomId);
          users = users.map(u => u.id === studentId ? { ...u, roomNumber: room?.roomNumber } : u);
        }
      );
    }
  },

  complaints: {
    getAll: async (userId?: string): Promise<Complaint[]> => {
      const endpoint = userId ? `/complaints?userId=${userId}` : '/complaints';
      return fetchWithFallback(
        endpoint,
        undefined,
        async () => {
          await delay(300);
          if (userId) return complaints.filter(c => c.studentId === userId);
          return [...complaints];
        }
      );
    },
    create: async (data: Partial<Complaint>, user: User): Promise<Complaint> => {
      return fetchWithFallback(
        '/complaints',
        { 
          method: 'POST', 
          body: JSON.stringify({ ...data, studentId: user.id, studentName: user.name }) 
        },
        async () => {
          await delay(300);
          const newComplaint: Complaint = {
            id: `c${Date.now()}`,
            studentId: user.id,
            studentName: user.name,
            category: data.category as any,
            description: data.description || '',
            date: new Date().toISOString().split('T')[0],
            status: ComplaintStatus.PENDING
          };
          complaints.unshift(newComplaint);
          return newComplaint;
        }
      );
    },
    updateStatus: async (id: string, status: ComplaintStatus): Promise<void> => {
      return fetchWithFallback(
        `/complaints/${id}/status`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        async () => {
          await delay(300);
          complaints = complaints.map(c => c.id === id ? { ...c, status } : c);
        }
      );
    }
  },

  mess: {
    getOrders: async (userId?: string): Promise<MealOrder[]> => {
      const endpoint = userId ? `/orders?userId=${userId}` : '/orders';
      return fetchWithFallback(
        endpoint,
        undefined,
        async () => {
          await delay(300);
          if (userId) return orders.filter(o => o.studentId === userId);
          return [...orders];
        }
      );
    },
    createOrder: async (itemIds: string[], time: string, user: User): Promise<MealOrder> => {
      return fetchWithFallback(
        '/orders',
        {
          method: 'POST',
          body: JSON.stringify({ 
            studentId: user.id, 
            studentName: user.name, 
            items: itemIds, 
            pickupTime: time 
          })
        },
        async () => {
          await delay(300);
          const newOrder: MealOrder = {
            id: `o${Date.now()}`,
            studentId: user.id,
            studentName: user.name,
            items: itemIds,
            date: new Date().toISOString().split('T')[0],
            pickupTime: time,
            status: OrderStatus.PENDING
          };
          orders.unshift(newOrder);
          return newOrder;
        }
      );
    },
    updateStatus: async (id: string, status: OrderStatus): Promise<void> => {
      return fetchWithFallback(
        `/orders/${id}/status`,
        { method: 'PATCH', body: JSON.stringify({ status }) },
        async () => {
          await delay(300);
          orders = orders.map(o => o.id === id ? { ...o, status } : o);
        }
      );
    }
  }
};
