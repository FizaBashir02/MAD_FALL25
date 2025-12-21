import React, { useState } from 'react';
import { Card, Button, StatusBadge, Modal } from '../components/UI';
import { Room, UserRole, Student } from '../types';
import { Users, UserPlus, Plus } from 'lucide-react';

interface RoomManagementProps {
  rooms: Room[];
  students: Student[];
  role: UserRole;
  onAssign: (roomId: string, studentId: string) => void;
  onAddRoom: (room: Omit<Room, 'id' | 'occupants'>) => void;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({ rooms, students, role, onAssign, onAddRoom }) => {
  // Add Room State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoomData, setNewRoomData] = useState<{ roomNumber: string; capacity: number; type: Room['type']; floor: number }>({
    roomNumber: '',
    capacity: 2,
    type: '2-bed',
    floor: 1
  });

  // Assign Student State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRoom(newRoomData);
    setIsAddModalOpen(false);
    setNewRoomData({ roomNumber: '', capacity: 2, type: '2-bed', floor: 1 });
  };

  const openAssignModal = (roomId: string) => {
    setSelectedRoomId(roomId);
    setSelectedStudentId('');
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoomId && selectedStudentId) {
      onAssign(selectedRoomId, selectedStudentId);
      setIsAssignModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
        {role === UserRole.ADMIN && (
          <Button icon={Plus} onClick={() => setIsAddModalOpen(true)}>Add Room</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const isFull = room.occupants.length >= room.capacity;
          const occupancyPercentage = (room.occupants.length / room.capacity) * 100;

          return (
            <Card key={room.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Room {room.roomNumber}</h3>
                        <p className="text-sm text-gray-500">{room.type} • Floor {room.floor}</p>
                    </div>
                    <StatusBadge status={isFull ? 'Occupied' : 'Vacant'} />
                </div>

                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1 text-gray-600">
                        <span>Occupancy</span>
                        <span>{room.occupants.length}/{room.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${occupancyPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                   <div className="flex -space-x-2">
                        {room.occupants.map((studentId, i) => (
                             <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600 overflow-hidden" title={students.find(s => s.id === studentId)?.name}>
                                {students.find(s => s.id === studentId)?.avatar ? (
                                    <img src={students.find(s => s.id === studentId)?.avatar} alt="S" className="w-full h-full object-cover"/>
                                ) : 'S'}
                             </div>
                        ))}
                        {[...Array(room.capacity - room.occupants.length)].map((_, i) => (
                             <div key={`empty-${i}`} className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                                <Users size={12} />
                             </div>
                        ))}
                   </div>
                   {(role === UserRole.ADMIN || role === UserRole.WARDEN) && !isFull && (
                       <button onClick={() => openAssignModal(room.id)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors" title="Assign Student">
                           <UserPlus size={18} />
                       </button>
                   )}
                </div>
            </Card>
          );
        })}
      </div>

      {/* Add Room Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Room">
         <form onSubmit={handleAddRoomSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Room Number</label>
                    <input 
                        required
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        value={newRoomData.roomNumber}
                        onChange={(e) => setNewRoomData({...newRoomData, roomNumber: e.target.value})}
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Floor</label>
                    <input 
                        required
                        type="number"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        value={newRoomData.floor}
                        onChange={(e) => setNewRoomData({...newRoomData, floor: parseInt(e.target.value)})}
                    />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Room Type</label>
                <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    value={newRoomData.type}
                    onChange={(e) => {
                        const type = e.target.value as Room['type'];
                        let capacity = 2;
                        if (type === '1-bed') capacity = 1;
                        if (type === '4-bed') capacity = 4;
                        setNewRoomData({...newRoomData, type, capacity});
                    }}
                >
                    <option value="1-bed">1-bed (Single)</option>
                    <option value="2-bed">2-bed (Shared)</option>
                    <option value="4-bed">4-bed (Dorm)</option>
                </select>
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button type="submit">Save Room</Button>
            </div>
         </form>
      </Modal>

      {/* Assign Student Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign Student to Room">
        <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
                <select
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                    <option value="">-- Choose a student --</option>
                    {students
                        .filter(s => !s.roomNumber) // Only show students without a room for better UX
                        .map(s => (
                        <option key={s.id} value={s.id}>
                            {s.name} ({s.studentId})
                        </option>
                    ))}
                    {/* Optional: Show all students but visually distinguish those with rooms */}
                     <optgroup label="Already Assigned (Move)">
                        {students.filter(s => s.roomNumber).map(s => (
                             <option key={s.id} value={s.id}>
                                {s.name} (Room {s.roomNumber})
                            </option>
                        ))}
                     </optgroup>
                </select>
                <p className="mt-1 text-xs text-gray-500">Students without a room are shown first.</p>
            </div>
             <div className="pt-4 flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={!selectedStudentId}>Confirm Assignment</Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};