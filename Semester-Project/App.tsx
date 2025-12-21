import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { RoomManagement } from './views/RoomManagement';
import { MessManagement } from './views/MessManagement';
import { ComplaintManagement } from './views/ComplaintManagement';
import { StudentManagement } from './views/StudentManagement';
import { MOCK_MENU } from './constants';
import { User, UserRole, OrderStatus, ComplaintStatus, Complaint, Student, Room, MealOrder } from './types';
import { Lock, Loader2 } from 'lucide-react';
import { api } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // App State
  const [rooms, setRooms] = useState<Room[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [orders, setOrders] = useState<MealOrder[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch Data based on role
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedRooms, fetchedStudents] = await Promise.all([
          api.rooms.getAll(),
          api.students.getAll()
        ]);
        setRooms(fetchedRooms);
        setStudents(fetchedStudents);

        if (user.role === UserRole.STUDENT) {
            const [myComplaints, myOrders] = await Promise.all([
                api.complaints.getAll(user.id),
                api.mess.getOrders(user.id)
            ]);
            setComplaints(myComplaints);
            setOrders(myOrders);
        } else {
            const [allComplaints, allOrders] = await Promise.all([
                api.complaints.getAll(),
                api.mess.getOrders()
            ]);
            setComplaints(allComplaints);
            setOrders(allOrders);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Login Handler
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await api.auth.login(email, password);
      setUser(loggedInUser);
      setCurrentView('dashboard');
    } catch (err) {
      setError("Invalid credentials. Try: admin@hostel.com / password123");
    } finally {
        setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    setRooms([]);
    setComplaints([]);
    setOrders([]);
  };

  // Logic Handlers
  const handleAddComplaint = async (complaintData: Partial<Complaint>) => {
    if (!user) return;
    const newComplaint = await api.complaints.create(complaintData, user);
    setComplaints([newComplaint, ...complaints]);
  };

  const handleUpdateComplaintStatus = async (id: string, status: ComplaintStatus) => {
    await api.complaints.updateStatus(id, status);
    setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
  };

  const handlePlaceOrder = async (itemIds: string[], time: string) => {
    if (!user) return;
    const newOrder = await api.mess.createOrder(itemIds, time, user);
    setOrders([newOrder, ...orders]);
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    await api.mess.updateStatus(id, status);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'role' | 'avatar' | 'password'>) => {
    const newStudent = await api.students.create(studentData);
    setStudents([...students, newStudent]);
  };

  const handleAddRoom = async (roomData: Omit<Room, 'id' | 'occupants'>) => {
    const newRoom = await api.rooms.create(roomData);
    setRooms([...rooms, newRoom]);
  };

  const handleAssignStudent = async (roomId: string, studentId: string) => {
    await api.rooms.assign(roomId, studentId);
    
    // Refresh local state to reflect changes
    const updatedRooms = rooms.map(room => {
        // Remove from old room if present (simplified local update)
        if (room.occupants.includes(studentId)) {
            return { ...room, occupants: room.occupants.filter(id => id !== studentId) };
        }
        // Add to new room
        if (room.id === roomId) {
            return { ...room, occupants: [...room.occupants, studentId] };
        }
        return room;
    });
    setRooms(updatedRooms);

    const room = updatedRooms.find(r => r.id === roomId);
    setStudents(students.map(s => s.id === studentId ? { ...s, roomNumber: room?.roomNumber } : s));
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Lock size={24} />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to HostelMate</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use demo accounts with password: <strong>password123</strong> <br/>
            <span className="font-mono text-xs bg-gray-100 p-1 rounded inline-block m-1">admin@hostel.com</span>
            <span className="font-mono text-xs bg-gray-100 p-1 rounded inline-block m-1">student@hostel.com</span>
            <span className="font-mono text-xs bg-gray-100 p-1 rounded inline-block m-1">kitchen@hostel.com</span>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
              const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
              handleLogin(email, password);
            }}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm text-center">{error}</div>}

              <div>
                <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !rooms.length) { // Initial data load
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <span className="ml-2 text-gray-600">Loading Hostel Data...</span>
          </div>
      )
  }

  return (
    <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout}>
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user} 
          stats={{
            students: students.length,
            rooms: rooms,
            complaints: complaints,
            orders: orders
          }} 
        />
      )}
      {currentView === 'rooms' && (
        <RoomManagement 
          rooms={rooms} 
          students={students} 
          role={user.role} 
          onAddRoom={handleAddRoom}
          onAssign={handleAssignStudent}
        />
      )}
      {currentView === 'mess' && (
        <MessManagement 
          menu={MOCK_MENU} 
          orders={orders} 
          role={user.role}
          onOrder={handlePlaceOrder}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}
      {currentView === 'complaints' && (
        <ComplaintManagement 
          complaints={complaints}
          role={user.role}
          onAddComplaint={handleAddComplaint}
          onUpdateStatus={handleUpdateComplaintStatus}
        />
      )}
      {currentView === 'students' && (
        <StudentManagement 
          students={students} 
          onAddStudent={handleAddStudent}
        />
      )}
    </Layout>
  );
};

export default App;