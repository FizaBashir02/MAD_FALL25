import React, { useState } from 'react';
import { Card, Button, Modal } from '../components/UI';
import { Student } from '../types';
import { Mail, Phone, Plus, MapPin, CreditCard, GraduationCap } from 'lucide-react';

interface StudentManagementProps {
    students: Student[];
    onAddStudent: (student: Omit<Student, 'id' | 'role' | 'avatar' | 'password'>) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAddStudent }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        contactNumber: '',
        emergencyContact: '',
        cnic: '',
        address: '',
        purposeOfStay: '',
        roomNumber: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddStudent(formData);
        setIsModalOpen(false);
        setFormData({
            name: '',
            email: '',
            studentId: '',
            contactNumber: '',
            emergencyContact: '',
            cnic: '',
            address: '',
            purposeOfStay: '',
            roomNumber: ''
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Add Student</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map(student => (
                    <Card key={student.id} className="flex flex-col items-center text-center">
                        <img 
                            src={student.avatar} 
                            alt={student.name} 
                            className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-gray-100"
                        />
                        <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-blue-600 font-medium mb-4">
                            ID: {student.studentId} • Room {student.roomNumber || 'Unassigned'}
                        </p>
                        
                        <div className="w-full space-y-2 text-left bg-gray-50 p-4 rounded-lg text-sm">
                             <div className="flex items-center text-gray-600">
                                <GraduationCap size={16} className="mr-2 flex-shrink-0" />
                                <span className="truncate" title={student.purposeOfStay}>{student.purposeOfStay}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Mail size={16} className="mr-2 flex-shrink-0" />
                                <span className="truncate">{student.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Phone size={16} className="mr-2 flex-shrink-0" />
                                <span>{student.contactNumber}</span>
                            </div>
                             <div className="flex items-center text-gray-600">
                                <MapPin size={16} className="mr-2 flex-shrink-0" />
                                <span className="truncate" title={student.address}>{student.address}</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 flex gap-2 w-full">
                            <Button variant="outline" className="flex-1 text-xs">View Full Profile</Button>
                            <Button variant="secondary" className="flex-1 text-xs">Message</Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Student">
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input 
                            required
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student ID</label>
                            <input 
                                required
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.studentId}
                                onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">CNIC / ID</label>
                            <input 
                                required
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.cnic}
                                onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            required
                            type="email"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input 
                                required
                                type="tel"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                            <input 
                                required
                                type="tel"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Purpose of Stay (e.g., Degree)</label>
                        <input 
                            required
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            value={formData.purposeOfStay}
                            onChange={(e) => setFormData({...formData, purposeOfStay: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Home Address</label>
                        <textarea 
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            rows={2}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Student</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}