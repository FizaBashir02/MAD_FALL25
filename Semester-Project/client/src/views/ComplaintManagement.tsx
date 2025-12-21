import React, { useState } from 'react';
import { Button, StatusBadge, Modal } from '../components/UI';
import { Complaint, UserRole, ComplaintStatus } from '../types';
import { Plus, Wand2, Trash2 } from 'lucide-react';
import { generateComplaintSummary } from '../services/geminiService';

interface ComplaintManagementProps {
  complaints: Complaint[];
  role: UserRole;
  onAddComplaint: (c: Partial<Complaint>) => void;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
  onDelete?: (id: string) => void;
}

export const ComplaintManagement: React.FC<ComplaintManagementProps> = ({ complaints, role, onAddComplaint, onUpdateStatus, onDelete }) => {
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
        <h1 className="text-2xl font-bold text-white">Complaints & Issues</h1>
        <div className="flex gap-2">
            {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                <Button variant="secondary" icon={Wand2} onClick={handleGenerateSummary} disabled={isSummarizing} className="hidden sm:flex">
                    {isSummarizing ? "Analyzing..." : "AI Summary"}
                </Button>
            )}
            {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                 <Button variant="secondary" onClick={handleGenerateSummary} disabled={isSummarizing} className="sm:hidden">
                    {isSummarizing ? "..." : "AI"}
                </Button>
            )}
            {role === UserRole.STUDENT && (
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>New Complaint</Button>
            )}
        </div>
      </div>

      {summary && (
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5 animate-fade-in-down">
            <h3 className="font-bold text-purple-300 mb-2 flex items-center"><Wand2 className="w-4 h-4 mr-2"/> AI Analysis Report</h3>
            <p className="text-purple-200 whitespace-pre-line text-sm leading-relaxed">{summary}</p>
            <button onClick={() => setSummary(null)} className="text-xs text-purple-400 mt-2 hover:underline">Dismiss</button>
        </div>
      )}

      {complaints.length === 0 && (
          <div className="text-center py-8 text-slate-500 glass-panel rounded-xl">No complaints found.</div>
      )}

      {complaints.length > 0 && (
          <div className="glass-panel rounded-xl overflow-hidden">
             <div className="overflow-x-auto no-scrollbar">
                 <table className="min-w-full divide-y divide-white/5">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ID</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Student</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Description</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                            {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {complaints.map(complaint => (
                            <tr key={complaint.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{complaint.id.split('_')[1] || complaint.id.slice(0, 4)}</td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-white">{complaint.studentName}</td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{complaint.category}</td>
                                <td className="px-4 md:px-6 py-4 text-sm text-slate-400 max-w-[150px] md:max-w-xs truncate">{complaint.description}</td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap"><StatusBadge status={complaint.status} /></td>
                                {(role === UserRole.ADMIN || role === UserRole.WARDEN) && (
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                        <select 
                                            value={complaint.status} 
                                            onChange={(e) => onUpdateStatus(complaint.id, e.target.value as ComplaintStatus)}
                                            className="bg-slate-800 border border-slate-700 rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500 text-white p-1"
                                        >
                                            <option value={ComplaintStatus.PENDING}>Pending</option>
                                            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                                            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                                        </select>
                                        {onDelete && (
                                            <button 
                                                onClick={() => onDelete(complaint.id)}
                                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-full"
                                                title="Delete Complaint"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                 </table>
             </div>
          </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit Complaint">
          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <select 
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
                  <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                  <textarea 
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 p-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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