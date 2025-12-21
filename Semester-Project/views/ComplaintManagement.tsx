import React, { useState } from 'react';
import { Card, Button, StatusBadge, Modal } from '../components/UI';
import { Complaint, UserRole, ComplaintStatus } from '../types';
import { Plus, MessageSquare, Wand2 } from 'lucide-react';
import { generateComplaintSummary } from '../services/geminiService';

interface ComplaintManagementProps {
  complaints: Complaint[];
  role: UserRole;
  onAddComplaint: (c: Partial<Complaint>) => void;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
}

export const ComplaintManagement: React.FC<ComplaintManagementProps> = ({ complaints, role, onAddComplaint, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newComplaint, setNewComplaint] = useState<{ category: Complaint['category']; description: string }>({ category: 'Other', description: '' });
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComplaint(newComplaint);
    setIsModalOpen(false);
    setNewComplaint({ category: 'Other', description: '' });
  };

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    const textData = complaints.map(c => `- [${c.category}] ${c.description} (${c.status})`).join('\n');
    const result = await generateComplaintSummary(textData);
    setSummary(result);
    setIsSummarizing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Complaints & Issues</h1>
        <div className="flex gap-2">
            {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                <Button variant="secondary" icon={Wand2} onClick={handleGenerateSummary} disabled={isSummarizing}>
                    {isSummarizing ? "Analyzing..." : "AI Summary"}
                </Button>
            )}
            {role === UserRole.STUDENT && (
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>New Complaint</Button>
            )}
        </div>
      </div>

      {summary && (
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-5 animate-fade-in-down">
            <h3 className="font-bold text-purple-900 mb-2 flex items-center"><Wand2 className="w-4 h-4 mr-2"/> AI Analysis Report</h3>
            <p className="text-purple-800 whitespace-pre-line text-sm leading-relaxed">{summary}</p>
            <button onClick={() => setSummary(null)} className="text-xs text-purple-600 mt-2 hover:underline">Dismiss</button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
         <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    )}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {complaints.map(complaint => (
                    <tr key={complaint.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{complaint.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{complaint.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={complaint.status} /></td>
                        {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <select 
                                    value={complaint.status} 
                                    onChange={(e) => onUpdateStatus(complaint.id, e.target.value as ComplaintStatus)}
                                    className="border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value={ComplaintStatus.PENDING}>Pending</option>
                                    <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                                    <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                                </select>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
         </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Complaint">
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value as Complaint['category']})}
                  >
                      <option>Plumbing</option>
                      <option>Electricity</option>
                      <option>Cleaning</option>
                      <option>Internet</option>
                      <option>Other</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    rows={4}
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    required
                  />
              </div>
              <div className="flex justify-end pt-2">
                  <Button type="submit">Submit Report</Button>
              </div>
          </form>
      </Modal>
    </div>
  );
};