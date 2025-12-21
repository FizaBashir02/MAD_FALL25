
import { User, Room, Complaint, MealOrder, Student, UserRole, OrderStatus, ComplaintStatus, AppNotification, MovementLog, FeeRecord, FeeStatus, WeeklyMenu } from '../types';
import { MOCK_USERS, MOCK_ROOMS, MOCK_COMPLAINTS, MOCK_ORDERS } from '../constants';

// --- Mock Data State ---
let users: any[] = JSON.parse(JSON.stringify(MOCK_USERS));
let rooms = [...MOCK_ROOMS];
let complaints = [...MOCK_COMPLAINTS];
let orders = [...MOCK_ORDERS];
let notifications: AppNotification[] = [];
let movementLogs: MovementLog[] = [];
let feeRecords: FeeRecord[] = [];

let weeklyMenuData: WeeklyMenu = {
    Monday: { breakfast: 'Eggs & Toast', lunch: 'Chicken Curry', dinner: 'Vegetable Rice' },
    Tuesday: { breakfast: 'Oatmeal', lunch: 'Beef Stew', dinner: 'Pasta' },
    Wednesday: { breakfast: 'Pancakes', lunch: 'Lentils', dinner: 'Roast Chicken' },
    Thursday: { breakfast: 'Omelette', lunch: 'Fish Fry', dinner: 'Soup & Bread' },
    Friday: { breakfast: 'French Toast', lunch: 'Biryani', dinner: 'Burgers' },
    Saturday: { breakfast: 'Paratha', lunch: 'Sandwiches', dinner: 'Pizza' },
    Sunday: { breakfast: 'Halwa Puri', lunch: 'Noodles', dinner: 'Barbecue' },
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Create Notification
const createNotification = (title: string, message: string, roles: UserRole[]) => {
  const notif: AppNotification = {
    id: `n${Date.now()}_${Math.random()}`,
    title,
    message,
    timestamp: new Date().toISOString(),
    isRead: false,
    targetRole: roles
  };
  notifications.unshift(notif);
};

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<User> => {
      await delay(500);
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) throw new Error("Invalid credentials");
      return user;
    },
    updateProfile: async (userId: string, avatar: string): Promise<User> => {
       await delay(300);
       const userIndex = users.findIndex(u => u.id === userId);
       if (userIndex > -1) {
           users[userIndex].avatar = avatar;
           return users[userIndex];
       }
       throw new Error("User not found");
    }
  },

  notifications: {
    getAll: async (role: UserRole): Promise<AppNotification[]> => {
      await delay(200);
      return notifications.filter(n => n.targetRole.includes(role));
    },
    markRead: async (id: string): Promise<void> => {
      const n = notifications.find(x => x.id === id);
      if (n) n.isRead = true;
    },
    delete: async (id: string): Promise<void> => {
      notifications = notifications.filter(n => n.id !== id);
    }
  },

  students: {
    getAll: async (): Promise<Student[]> => {
      await delay(300);
      return users.filter(u => u.role === UserRole.STUDENT) as unknown as Student[];
    },
    create: async (studentData: any): Promise<Student> => {
      await delay(300);
      const newStudent = {
        ...studentData,
        id: `s${Date.now()}`,
        role: UserRole.STUDENT,
        password: 'password123',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=random`,
        isCheckedIn: true // Default to IN upon creation
      };
      users.push(newStudent);
      
      // Auto-generate first fee record
      feeRecords.push({
          id: `f${Date.now()}`,
          studentId: newStudent.id,
          studentName: newStudent.name,
          amount: 500, // Default fee
          month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
          status: FeeStatus.PENDING
      });
      
      createNotification('New Student', `${newStudent.name} joined the hostel.`, [UserRole.ADMIN, UserRole.WARDEN]);

      return newStudent;
    },
    delete: async (studentId: string): Promise<void> => {
        await delay(300);
        const student = users.find(u => u.id === studentId);
        if(!student) return;

        // 1. Remove User
        users = users.filter(u => u.id !== studentId);
        
        // 2. Remove from Room
        rooms = rooms.map(r => ({
            ...r,
            occupants: r.occupants.filter(oid => oid !== studentId)
        }));

        // 3. Cleanup data (optional, but requested "remove from everywhere")
        complaints = complaints.filter(c => c.studentId !== studentId);
        orders = orders.filter(o => o.studentId !== studentId);
        feeRecords = feeRecords.filter(f => f.studentId !== studentId);
        movementLogs = movementLogs.filter(m => m.studentId !== studentId);

        createNotification('Student Removed', `${student.name} was removed from the system.`, [UserRole.ADMIN, UserRole.WARDEN]);
    }
  },

  movement: {
    getLogs: async (): Promise<MovementLog[]> => {
      await delay(300);
      return [...movementLogs].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    logMovement: async (studentId: string, type: 'CHECK_IN' | 'CHECK_OUT', reason?: string): Promise<void> => {
      await delay(400);
      const student = users.find(u => u.id === studentId);
      if (student) {
        student.isCheckedIn = (type === 'CHECK_IN');
        const log: MovementLog = {
          id: `m${Date.now()}`,
          studentId,
          studentName: student.name,
          type,
          reason,
          timestamp: new Date().toISOString()
        };
        movementLogs.unshift(log);

        // Notify Admin/Warden
        createNotification(
          `Student ${type === 'CHECK_IN' ? 'Check In' : 'Check Out'}`,
          `${student.name}: ${reason || 'No reason provided'}`,
          [UserRole.ADMIN, UserRole.WARDEN]
        );
      }
    },
    delete: async (id: string): Promise<void> => {
        await delay(200);
        movementLogs = movementLogs.filter(m => m.id !== id);
    }
  },

  fees: {
    getAll: async (): Promise<FeeRecord[]> => {
      await delay(300);
      return [...feeRecords];
    },
    getByStudent: async (studentId: string): Promise<FeeRecord[]> => {
      await delay(300);
      return feeRecords.filter(f => f.studentId === studentId);
    },
    submitProof: async (feeId: string, transactionId: string): Promise<void> => {
      await delay(500);
      const fee = feeRecords.find(f => f.id === feeId);
      if (fee) {
        fee.status = FeeStatus.SUBMITTED;
        fee.submissionDate = new Date().toISOString();
        fee.transactionId = transactionId;
        createNotification('Fee Paid', `${fee.studentName} paid fee. Ref: ${transactionId}`, [UserRole.ADMIN]);
      }
    },
    approve: async (feeId: string): Promise<void> => {
      await delay(300);
      const fee = feeRecords.find(f => f.id === feeId);
      if (fee) {
        fee.status = FeeStatus.PAID;
      }
    },
    delete: async (id: string): Promise<void> => {
        await delay(200);
        feeRecords = feeRecords.filter(f => f.id !== id);
    }
  },

  rooms: {
    getAll: async (): Promise<Room[]> => {
       await delay(300);
       return [...rooms];
    },
    create: async (roomData: any): Promise<Room> => {
       await delay(300);
       const newRoom = { ...roomData, id: `r${Date.now()}`, occupants: [] };
       rooms.push(newRoom);
       return newRoom;
    },
    assign: async (roomId: string, studentId: string): Promise<void> => {
       await delay(300);
       // Remove from old
       rooms.forEach(r => { r.occupants = r.occupants.filter(id => id !== studentId); });
       // Add to new
       const room = rooms.find(r => r.id === roomId);
       if (room) {
           room.occupants.push(studentId);
           const student = users.find(u => u.id === studentId);
           if (student) student.roomNumber = room.roomNumber;
       }
    }
  },

  complaints: {
    getAll: async (userId?: string): Promise<Complaint[]> => {
       await delay(300);
       if (userId) return complaints.filter(c => c.studentId === userId);
       return [...complaints];
    },
    create: async (data: any, user: User): Promise<Complaint> => {
       await delay(300);
       const newC: Complaint = {
           id: `c${Date.now()}`,
           studentId: user.id,
           studentName: user.name,
           category: data.category,
           description: data.description,
           date: new Date().toISOString().split('T')[0],
           status: ComplaintStatus.PENDING
       };
       complaints.unshift(newC);
       createNotification('New Complaint', `${user.name}: ${data.category}`, [UserRole.ADMIN, UserRole.WARDEN]);
       return newC;
    },
    updateStatus: async (id: string, status: ComplaintStatus): Promise<void> => {
       await delay(300);
       const c = complaints.find(x => x.id === id);
       if (c) c.status = status;
    },
    delete: async (id: string): Promise<void> => {
       await delay(200);
       complaints = complaints.filter(c => c.id !== id);
    }
  },

  mess: {
    getOrders: async (userId?: string): Promise<MealOrder[]> => {
       await delay(300);
       if (userId) return orders.filter(o => o.studentId === userId);
       return [...orders];
    },
    createOrder: async (items: string[], time: string, user: User): Promise<MealOrder> => {
       await delay(300);
       const newOrder: MealOrder = {
           id: `o${Date.now()}`,
           studentId: user.id,
           studentName: user.name,
           items,
           date: new Date().toISOString().split('T')[0],
           pickupTime: time,
           status: OrderStatus.PENDING
       };
       orders.unshift(newOrder);
       return newOrder;
    },
    updateStatus: async (id: string, status: OrderStatus): Promise<void> => {
       await delay(300);
       const o = orders.find(x => x.id === id);
       if (o) o.status = status;
    },
    getWeeklyMenu: async (): Promise<WeeklyMenu> => {
       await delay(300);
       return weeklyMenuData;
    },
    updateWeeklyMenu: async (menu: WeeklyMenu): Promise<void> => {
       await delay(300);
       weeklyMenuData = menu;
    }
  }
};
