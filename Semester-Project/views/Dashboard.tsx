import React from 'react';
import { Card } from '../components/UI';
import { User, Room, Complaint, MealOrder, UserRole } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, Bed, AlertCircle, Utensils } from 'lucide-react';

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
  const totalCapacity = stats.rooms.reduce((acc, room) => acc + room.capacity, 0);
  const occupiedBeds = stats.rooms.reduce((acc, room) => acc + room.occupants.length, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

  const pendingComplaints = stats.complaints.filter(c => c.status === 'Pending').length;
  const pendingOrders = stats.orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;

  const occupancyData = [
    { name: 'Occupied', value: occupiedBeds },
    { name: 'Vacant', value: totalCapacity - occupiedBeds },
  ];
  const COLORS = ['#3b82f6', '#e2e8f0'];

  const complaintData = [
    { name: 'Pending', value: stats.complaints.filter(c => c.status === 'Pending').length },
    { name: 'In Progress', value: stats.complaints.filter(c => c.status === 'In Progress').length },
    { name: 'Resolved', value: stats.complaints.filter(c => c.status === 'Resolved').length },
  ];

  const StatBox = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 mr-4`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}</h1>
            <p className="text-gray-500 mt-1">Here is what's happening in the hostel today.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-medium text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox label="Total Students" value={stats.students} icon={Users} color="bg-indigo-600" />
        <StatBox label="Occupancy Rate" value={`${occupancyRate}%`} icon={Bed} color="bg-emerald-600" />
        <StatBox label="Pending Complaints" value={pendingComplaints} icon={AlertCircle} color="bg-amber-500" />
        <StatBox label="Active Meal Orders" value={pendingOrders} icon={Utensils} color="bg-pink-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <Card title="Room Occupancy" className="min-h-[300px]">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>Occupied</div>
                <div className="flex items-center"><div className="w-3 h-3 bg-slate-200 rounded-full mr-2"></div>Vacant</div>
            </div>
        </Card>

        {/* Complaint Status Chart */}
        <Card title="Complaint Overview" className="min-h-[300px]">
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complaintData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: '#f1f5f9'}} />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
      </div>

      {user.role === UserRole.STUDENT && (
          <Card title="My Status">
              <div className="space-y-4">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Room Status</span>
                      <span className="font-semibold text-green-600">Assigned (101)</span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Pending Fees</span>
                      <span className="font-semibold text-gray-900">$0.00</span>
                  </div>
              </div>
          </Card>
      )}
    </div>
  );
};