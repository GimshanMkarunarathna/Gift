import React, { useState } from 'react';
import { api } from '../../services/api';
import { SparkleStarIcon, LilyFlowerIcon } from '../brand/BrandIcons';

interface AdminCustomRequestsProps {
  requests: any[];
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminCustomRequests: React.FC<AdminCustomRequestsProps> = ({
  requests,
  onRefresh,
  onShowToast,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      await api.customRequests.updateStatus(requestId, newStatus);
      onShowToast(`Request status updated to "${newStatus}"`);
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest((prev: any) => ({ ...prev, status: newStatus }));
      }
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to update request status');
    }
  };

  const handleDelete = async (req: any) => {
    if (!confirm(`Are you sure you want to delete custom request ${req.requestNumber}?`)) return;
    try {
      await api.customRequests.delete(req.id);
      onShowToast(`Custom request ${req.requestNumber} deleted`);
      if (selectedRequest?.id === req.id) setSelectedRequest(null);
      onRefresh();
    } catch (err: any) {
      onShowToast(err.message || 'Failed to delete request');
    }
  };

  const filtered = requests.filter((r) => {
    const searchMatch =
      (r.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.requestNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.caption || '').toLowerCase().includes(search.toLowerCase());
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8D8] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4CAF50] text-[22px]">palette</span>
            <h3 className="text-lg font-bold text-[#2B2D2F]">Customer Custom Gify &amp; Bespoke Requests</h3>
          </div>
          <p className="text-xs text-[#7A8276] mt-1">
            Review customer personalized Gify designs, customized keepsakes, calligraphy greetings, and manage fulfillment workflow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF5EC] text-[#2D6A4F] border border-[#2D6A4F]/20">
            {requests.length} Total Custom Orders
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#FAF9F6] p-4 rounded-xl border border-[#E2E8D8]">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#7A8276] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by customer, caption, or ref ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#E2E8D8] focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none text-[#2B2D2F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'processing', 'completed', 'shipped'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#4CAF50] text-white shadow-2xs'
                  : 'bg-white text-[#7A8276] border border-[#E2E8D8] hover:bg-[#FAFBF9]'
              }`}
            >
              <span className="capitalize">{status === 'all' ? 'All Requests' : status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8D8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F2] text-[#688457] font-bold uppercase tracking-wider border-b border-[#E2E8D8]">
              <tr>
                <th className="py-3.5 px-4">Request Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Motif &amp; Caption</th>
                <th className="py-3.5 px-4">Theme / Motion</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Workflow Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFE5]">
              {filtered.length > 0 ? (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-[#FAFBF9] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-[#2B2D2F]">{req.requestNumber}</div>
                      <div className="text-[10px] text-[#7A8276] mt-0.5">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#2B2D2F]">{req.customerName}</div>
                      {req.customerEmail && (
                        <div className="text-[11px] text-[#7A8276]">{req.customerEmail}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {req.motif === 'lily' ? '🌸' : req.motif === 'bunny' ? '🐰' : req.motif === 'butterfly' ? '🦋' : '✨'}
                        </span>
                        <div>
                          <div className="font-bold text-[#2B2D2F] line-clamp-1">{req.title}</div>
                          <div className="text-[11px] text-[#7A8276] line-clamp-1 italic max-w-xs mt-0.5">
                            "{req.caption}"
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-mono bg-[#FAF9F6] border border-[#E2E8D8]">
                        <span className="capitalize">{req.colorTheme || 'lily-green'}</span>
                        <span>•</span>
                        <span className="capitalize">{req.animationSpeed || 'gentle'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#2D6A4F]">
                      LKR {(req.amount || 2500).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {/* Interactive Status Selector */}
                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                        className={`text-[11px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 outline-none border cursor-pointer transition-all ${
                          req.status === 'completed'
                            ? 'bg-[#EAF5EC] text-[#2D6A4F] border-[#A3D9B1]'
                            : req.status === 'shipped'
                            ? 'bg-[#E3F2FD] text-[#1976D2] border-[#90CAF9]'
                            : req.status === 'processing'
                            ? 'bg-[#FFF8E1] text-[#F57F17] border-[#FFE082]'
                            : 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="shipped">Shipped</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-1.5 rounded-lg text-[#2D6A4F] hover:bg-[#EAF5EC] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => handleDelete(req)}
                          className="p-1.5 rounded-lg text-[#C62828] hover:bg-[#FFEBEE] transition-colors cursor-pointer"
                          title="Delete Request"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A8276]">
                    No custom maker creations found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL VIEW MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E2E8D8] shadow-xl overflow-hidden animate-scaleUp">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8D8] bg-[#FAF9F6]">
              <div className="flex items-center gap-2">
                <SparkleStarIcon size={18} color="#4CAF50" />
                <h3 className="font-bold text-base text-[#2B2D2F]">
                  Request Details — {selectedRequest.requestNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A8276] hover:bg-[#E2E8D8] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Card visual representation */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FAF9F6] to-[#EFF5ED] border border-[#E2E8D8] text-center space-y-3">
                <div className="text-4xl">
                  {selectedRequest.motif === 'lily' ? '🌸' : selectedRequest.motif === 'bunny' ? '🐰' : selectedRequest.motif === 'butterfly' ? '🦋' : '✨'}
                </div>
                <div className="font-serif font-bold text-base text-[#2B2D2F]">
                  {selectedRequest.title}
                </div>
                <div className="italic text-[#4A5568] max-w-sm mx-auto bg-white/80 p-3 rounded-xl border border-[#E2E8D8]">
                  "{selectedRequest.caption}"
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#4CAF50] text-white">
                    {selectedRequest.colorTheme}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#E9C46A] text-[#2B2D2F]">
                    Speed: {selectedRequest.animationSpeed}
                  </span>
                </div>
              </div>

              {/* Client information */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-[#E2E8D8] bg-[#FAF9F6]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8276] block mb-1">
                    Customer
                  </span>
                  <div className="font-bold text-[#2B2D2F]">{selectedRequest.customerName}</div>
                  <div className="text-[#7A8276]">{selectedRequest.customerEmail || 'Guest'}</div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A8276] block mb-1">
                    Created Timestamp
                  </span>
                  <div className="font-mono text-[#2B2D2F]">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </div>
                  <div className="font-mono font-bold text-[#2D6A4F] mt-1">
                    LKR {(selectedRequest.amount || 2500).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div>
                <label className="block text-xs font-bold text-[#2B2D2F] mb-2">Update Workflow Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['pending', 'processing', 'completed', 'shipped'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedRequest.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        selectedRequest.status === st
                          ? 'bg-[#4CAF50] text-white shadow-xs'
                          : 'bg-[#F4F6F2] text-[#7A8276] hover:bg-[#E2E8D8]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-[#E2E8D8]">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#2B2D2F] hover:bg-[#1E1F20] text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
