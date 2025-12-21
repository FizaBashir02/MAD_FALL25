
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { RoomManagement } from './views/RoomManagement';
import { MessManagement } from './views/MessManagement';
import { ComplaintManagement } from './views/ComplaintManagement';
import { StudentManagement } from './views/StudentManagement';
import { User, UserRole, OrderStatus, ComplaintStatus, Complaint, Student, Room, MealOrder } from './types';
import { Lock, Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { api } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // App Data
  const [rooms, setRooms] = useState<Room[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [orders, setOrders] = useState<MealOrder[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user]);

  const refreshData = async () => {
      if(!user) return;
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
        console.error("Data load error", err);
      } finally {
        setIsLoading(false);
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await api.auth.login(email, password);
      setUser(loggedInUser);
      setCurrentView('dashboard');
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    setIsLoading(true);
    try {
        const newUser = await api.students.create({ name, email, password });
        setUser(newUser);
        setCurrentView('dashboard');
    } catch (err) {
        setError("Registration failed");
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
  
  const handleUpdateProfile = async (avatar: string) => {
      if(user) {
          await api.auth.updateProfile(user.id, avatar);
          setUser({...user, avatar});
      }
  }

  // Action Wrappers
  const handleAddComplaint = async (data: Partial<Complaint>) => {
      if(!user) return;
      const c = await api.complaints.create(data, user);
      setComplaints([c, ...complaints]);
  };
  const handleUpdateComplaintStatus = async (id: string, status: ComplaintStatus) => {
      await api.complaints.updateStatus(id, status);
      setComplaints(prev => prev.map(c => c.id === id ? {...c, status} : c));
  };
  const handleDeleteComplaint = async (id: string) => {
      await api.complaints.delete(id);
      setComplaints(prev => prev.filter(c => c.id !== id));
  };
  const handlePlaceOrder = async (items: string[], time: string) => {
      if(!user) return;
      const o = await api.mess.createOrder(items, time, user);
      setOrders([o, ...orders]);
  };
  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
      await api.mess.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
  };
  const handleAddRoom = async (data: any) => {
      const r = await api.rooms.create(data);
      setRooms([...rooms, r]);
  };
  const handleAssign = async (roomId: string, studentId: string) => {
      await api.rooms.assign(roomId, studentId);
      refreshData();
  };
  const handleAddStudent = async (data: any) => {
      const s = await api.students.create(data);
      setStudents([...students, s]);
  };
  const handleDeleteStudent = async (id: string) => {
      await api.students.delete(id);
      refreshData(); // Reload all data to reflect cascading deletes (rooms, etc)
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Lock size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
             {isRegistering ? 'Create Account' : 'Sign In'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
          <div className="bg-white/5 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl border border-white/10 sm:px-10">
            <form className="space-y-6" onSubmit={isRegistering ? handleRegister : handleLogin}>
              {isRegistering && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Full Name</label>
                    <input name="name" type="text" required className="mt-1 block w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white" />
                  </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300">Email address</label>
                <input name="email" type="email" required className="mt-1 block w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Password</label>
                <input name="password" type="password" required className="mt-1 block w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-white" />
              </div>

              {error && <div className="text-red-400 text-sm text-center">{error}</div>}

              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
                {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : (isRegistering ? "Sign Up" : "Sign In")}
              </button>
            </form>

            <div className="mt-6 text-center">
                <button onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center w-full">
                    {isRegistering ? <><ArrowLeft size={16} className="mr-1"/> Back to Login</> : <><UserPlus size={16} className="mr-1"/> Create New Student ID</>}
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !rooms.length && !students.length) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
              <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
          </div>
      )
  }

  return (
    <Layout user={user} currentView={currentView} onNavigate={setCurrentView} onLogout={handleLogout} onUpdateProfile={handleUpdateProfile}>
      {currentView === 'dashboard' && (
        <Dashboard user={user} stats={{ students: students.length, rooms, complaints, orders }} />
      )}
      {currentView === 'rooms' && (
        <RoomManagement rooms={rooms} students={students} role={user.role} onAddRoom={handleAddRoom} onAssign={handleAssign} />
      )}
      {currentView === 'mess' && (
        <MessManagement orders={orders} role={user.role} onOrder={handlePlaceOrder} onUpdateStatus={handleUpdateOrderStatus} />
      )}
      {currentView === 'complaints' && (
        <ComplaintManagement complaints={complaints} role={user.role} onAddComplaint={handleAddComplaint} onUpdateStatus={handleUpdateComplaintStatus} onDelete={handleDeleteComplaint} />
      )}
      {currentView === 'students' && (
        <StudentManagement students={students} userRole={user.role} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteStudent} />
      )}
    </Layout>
  );
};

export default App;
