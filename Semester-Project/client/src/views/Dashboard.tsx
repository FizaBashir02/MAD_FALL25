
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, StatusBadge } from '../components/UI';
import { User, Room, Complaint, MealOrder, UserRole, FeeRecord, MovementLog, FeeStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Users, Bed, AlertCircle, Utensils, LogOut, LogIn, CheckCircle, Clock, Trash2, CreditCard } from 'lucide-react';
import { api } from '../services/api';

interface DashboardProps {
  user: User;
  stats: {
    students: number;
    rooms: Room[];
    complaints: Complaint[];
    orders: MealOrder[];
  }
}

export const Dashboard: React.FC<DashboardProps> = ({ user, stats }) => {
  const [movementLogs, setMovementLogs] = useState<MovementLog[]>([]);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  
  // Modals
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [moveReason, setMoveReason] = useState('');
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    // 1. Load Movement Status (for students) & Logs
    const logs = await api.movement.getLogs();
    setMovementLogs(logs);
    if (user.role === UserRole.STUDENT) {
        const me = (await api.students.getAll()).find(s => s.id === user.id);
        if (me) setIsCheckedIn(me.isCheckedIn);
        const myFees = await api.fees.getByStudent(user.id);
        setFeeRecords(myFees);
    } else if (user.role === UserRole.ADMIN || user.role === UserRole.WARDEN) {
        const allFees = await api.fees.getAll();
        setFeeRecords(allFees);
    }
  };

  const handleMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = isCheckedIn ? 'CHECK_OUT' : 'CHECK_IN';
    await api.movement.logMovement(user.id, type, moveReason);
    setIsCheckedIn(!isCheckedIn);
    setIsMoveModalOpen(false);
    setMoveReason('');
    loadDashboardData(); // Refresh logs
  };

  const handleFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFee && transactionId) {
        await api.fees.submitProof(selectedFee.id, transactionId);
        setIsFeeModalOpen(false);
        setTransactionId('');
        loadDashboardData();
        alert("Fee details submitted successfully!");
    }
  };

  const handleFeeApprove = async (id: string) => {
      await api.fees.approve(id);
      loadDashboardData();
  };

  const handleDeleteFee = async (id: string) => {
    if (confirm("Are you sure you want to delete this fee record?")) {
        await api.fees.delete(id);
        loadDashboardData();
    }
  };

  const handleDeleteMovement = async (id: string) => {
      if (confirm("Delete this log entry?")) {
          await api.movement.delete(id);
          loadDashboardData();
      }
  };

  // --- Render Helpers ---
  const totalCapacity = stats.rooms.reduce((acc, room) => acc + room.capacity, 0);
  const occupiedBeds = stats.rooms.reduce((acc, room) => acc + room.occupants.length, 0);
  const occupancyData = [{ name: 'Occupied', value: occupiedBeds }, { name: 'Vacant', value: totalCapacity - occupiedBeds }];
  const COLORS = ['#3b82f6', '#e2e8f0'];

  const StatBox = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex items-center">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 mr-4`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold dark:text-white">Welcome, {user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">Dashboard Overview</p>
        </div>
        
        {/* Student Check In/Out Controls */}
        {user.role === UserRole.STUDENT && (
            <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${isCheckedIn ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isCheckedIn ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`font-bold ${isCheckedIn ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {isCheckedIn ? 'Checked IN' : 'Checked OUT'}
                    </span>
                </div>
                <Button 
                    variant={isCheckedIn ? 'danger' : 'primary'} 
                    size="sm"
                    onClick={() => setIsMoveModalOpen(true)}
                    icon={isCheckedIn ? LogOut : LogIn}
                >
                    {isCheckedIn ? 'Check Out' : 'Check In'}
                </Button>
            </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Students" value={stats.students} icon={Users} color="bg-indigo-600" />
        <StatBox label="Occupancy" value={`${totalCapacity > 0 ? Math.round((occupiedBeds/totalCapacity)*100) : 0}%`} icon={Bed} color="bg-emerald-600" />
        <StatBox label="Issues" value={stats.complaints.filter(c => c.status === 'Pending').length} icon={AlertCircle} color="bg-amber-500" />
        <StatBox label="Meals" value={stats.orders.filter(o => o.status === 'Pending').length} icon={Utensils} color="bg-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <Card title="Room Status">
            <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={occupancyData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {occupancyData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>Occupied</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-slate-200 rounded-full mr-2"></div>Vacant</span>
            </div>
        </Card>

        {/* Movement Logs (Admin & Student) */}
        <Card title="Recent Activity" className="overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 pr-2 custom-scrollbar">
                {movementLogs.length === 0 && <p className="text-center text-gray-500 py-4">No recent movements.</p>}
                {movementLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-start p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700 group">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${log.type === 'CHECK_IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {log.type === 'CHECK_IN' ? 'IN' : 'OUT'}
                                </span>
                                <span className="font-medium dark:text-gray-200">{log.studentName}</span>
                            </div>
                            {log.reason && <p className="text-xs text-gray-500 mt-1 italic">"{log.reason}"</p>}
                        </div>
                        <div className="text-right flex items-center gap-2">
                            <div>
                                <span className="text-xs text-gray-400 flex items-center justify-end"><Clock size={10} className="mr-1"/>{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <span className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                            </div>
                            {(user.role === UserRole.ADMIN || user.role === UserRole.WARDEN) && (
                                <button onClick={() => handleDeleteMovement(log.id)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>

      {/* Fee Management Section */}
      <Card title="Fee Management">
         <div className="overflow-x-auto">
             <table className="min-w-full text-sm">
                 <thead className="bg-gray-50 dark:bg-slate-800">
                     <tr>
                         <th className="px-4 py-3 text-left">Month</th>
                         <th className="px-4 py-3 text-left">Amount</th>
                         {(user.role === UserRole.ADMIN || user.role === UserRole.WARDEN) && <th className="px-4 py-3 text-left">Student</th>}
                         <th className="px-4 py-3 text-left">Status</th>
                         <th className="px-4 py-3 text-left">Details</th>
                         <th className="px-4 py-3 text-right">Action</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                     {feeRecords.map(fee => (
                         <tr key={fee.id}>
                             <td className="px-4 py-3 font-medium">{fee.month}</td>
                             <td className="px-4 py-3">${fee.amount}</td>
                             {(user.role === UserRole.ADMIN || user.role === UserRole.WARDEN) && <td className="px-4 py-3">{fee.studentName}</td>}
                             <td className="px-4 py-3"><StatusBadge status={fee.status} /></td>
                             <td className="px-4 py-3 text-xs text-gray-500">
                                {fee.transactionId && <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 rounded">{fee.transactionId}</span>}
                             </td>
                             <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                                 {user.role === UserRole.STUDENT && fee.status === FeeStatus.PENDING && (
                                     <Button size="sm" icon={CreditCard} onClick={() => { setSelectedFee(fee); setIsFeeModalOpen(true); }}>Pay</Button>
                                 )}
                                 {(user.role === UserRole.ADMIN || user.role === UserRole.WARDEN) && (
                                     <>
                                        {fee.status === FeeStatus.SUBMITTED && (
                                            <Button size="sm" icon={CheckCircle} onClick={() => handleFeeApprove(fee.id)}>Confirm</Button>
                                        )}
                                        <button 
                                            onClick={() => handleDeleteFee(fee.id)} 
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Delete Record"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                     </>
                                 )}
                             </td>
                         </tr>
                     ))}
                     {feeRecords.length === 0 && <tr><td colSpan={6} className="text-center py-4 text-gray-500">No fee records found.</td></tr>}
                 </tbody>
             </table>
         </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} title={isCheckedIn ? 'Check Out Form' : 'Check In Form'}>
         <form onSubmit={handleMovement} className="space-y-4">
             {isCheckedIn && (
                 <div>
                     <label className="block text-sm font-medium mb-1 dark:text-gray-300">Reason for Leaving</label>
                     <textarea required className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-600" rows={3} placeholder="Going to market, home, etc." value={moveReason} onChange={e => setMoveReason(e.target.value)} />
                 </div>
             )}
             {!isCheckedIn && <p className="dark:text-gray-300">Are you sure you are back in the hostel?</p>}
             <div className="flex justify-end gap-2 pt-2">
                 <Button type="submit">{isCheckedIn ? 'Confirm Check Out' : 'Confirm Check In'}</Button>
             </div>
         </form>
      </Modal>

      <Modal isOpen={isFeeModalOpen} onClose={() => setIsFeeModalOpen(false)} title="Submit Payment Details">
          <form onSubmit={handleFeeSubmit} className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                  <p className="text-blue-700 dark:text-blue-300 font-bold">Amount Due: ${selectedFee?.amount}</p>
                  <p className="text-xs mt-1 dark:text-blue-400">Please transfer to Bank Account #123456789</p>
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Transaction ID / Reference Number</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-600" 
                    placeholder="e.g. TXN-12345678"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the transaction reference from your banking app.</p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                  <Button type="submit">Submit Payment</Button>
              </div>
          </form>
      </Modal>

    </div>
  );
};
