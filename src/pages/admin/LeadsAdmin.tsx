import React, { useState } from 'react';
import { useLeads } from '../../hooks/useDataHooks';
import { Inquiry } from '../../types';
import { Search, Trash2, Eye, Mail, Phone, MapPin, Calendar, CheckCircle2, Clock, Filter, AlertTriangle } from 'lucide-react';
import { Modal } from '../../components/Modal';

export const LeadsAdmin: React.FC = () => {
  const { leads, loading, updateStatus, remove } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Inquiry | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.projectType && lead.projectType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    await updateStatus(id, newStatus);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await remove(deleteTargetId);
      setDeleteTargetId(null);
      if (selectedLead?.id === deleteTargetId) {
        setSelectedLead(null);
      }
    }
  };

  const getStatusBadgeClass = (status: Inquiry['status']) => {
    switch (status) {
      case 'New':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'In Review':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Contacted':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Converted':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Archived':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-surface-variant text-on-surface-variant';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-tertiary-fixed-dim border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex justify-between items-center border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-headline-md text-2xl font-bold uppercase tracking-wider text-on-surface">
            Client Inquiries & Consultation Leads
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant mt-1">
            Track, process, and convert incoming client consultation and estimator leads.
          </p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container/30 border border-outline-variant/30 p-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container text-on-surface pl-9 pr-3 py-2 text-sm border border-outline-variant focus:outline-none focus:border-tertiary-fixed-dim"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-tertiary-fixed-dim" />
          <span className="font-label-caps text-xs text-on-surface-variant uppercase tracking-widest shrink-0">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container text-on-surface border border-outline-variant px-3 py-2 text-xs font-label-caps focus:outline-none focus:border-tertiary-fixed-dim"
          >
            <option value="All">All Inquiries ({leads.length})</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-surface-container/30 border border-outline-variant/30 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-high/50 font-label-caps text-xs text-on-surface-variant uppercase tracking-widest">
              <th className="p-4">Client Name</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Project Type & Budget</th>
              <th className="p-4">Received Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 text-sm">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-on-surface-variant font-body-md text-xs">
                  No consultation inquiries match your search parameters.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-container/60 transition-colors">
                  <td className="p-4 font-semibold text-on-surface">
                    {lead.name}
                    {lead.plotArea && (
                      <span className="block text-[11px] font-mono-technical text-tertiary-fixed-dim font-normal">
                        {lead.plotArea} Sq.Ft Plot
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-xs space-y-0.5 text-on-surface-variant font-mono-technical">
                    <div>{lead.phone}</div>
                    <div>{lead.email}</div>
                  </td>
                  <td className="p-4 text-xs text-on-surface-variant">
                    <div className="font-semibold text-on-surface">{lead.projectType || 'Turnkey Residential'}</div>
                    <div className="text-tertiary-fixed-dim">{lead.budget || lead.estimatedBudget || 'Under Consultation'}</div>
                  </td>
                  <td className="p-4 text-xs font-mono-technical text-on-surface-variant">
                    {lead.createdAt}
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Inquiry['status'])}
                      className={`text-xs font-label-caps px-2.5 py-1 border rounded-none cursor-pointer focus:outline-none ${getStatusBadgeClass(
                        lead.status
                      )}`}
                    >
                      <option value="New">New</option>
                      <option value="In Review">In Review</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 hover:bg-surface-container text-tertiary-fixed-dim cursor-pointer"
                        title="View Lead Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(lead.id)}
                        className="p-1.5 hover:bg-surface-container text-error cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Modal isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} title="Client Consultation Lead Details">
          <div className="space-y-6 text-on-surface">
            <div className="flex justify-between items-start border-b border-outline-variant pb-3">
              <div>
                <h3 className="font-headline-md font-bold text-lg">{selectedLead.name}</h3>
                <span className="font-mono-technical text-xs text-tertiary-fixed-dim">
                  Inquiry Reference ID: {selectedLead.id}
                </span>
              </div>
              <span className={`text-xs font-label-caps px-3 py-1 border ${getStatusBadgeClass(selectedLead.status)}`}>
                {selectedLead.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-technical">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Phone className="w-4 h-4 text-tertiary-fixed-dim" />
                <span>{selectedLead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Mail className="w-4 h-4 text-tertiary-fixed-dim" />
                <span>{selectedLead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <MapPin className="w-4 h-4 text-tertiary-fixed-dim" />
                <span>{selectedLead.location || 'Odisha Region'}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Calendar className="w-4 h-4 text-tertiary-fixed-dim" />
                <span>Submitted: {selectedLead.createdAt}</span>
              </div>
            </div>

            <div className="bg-surface-container/50 p-4 space-y-2 border border-outline-variant/30 text-xs">
              <div className="font-label-caps uppercase tracking-wider text-tertiary-fixed-dim font-bold">
                Project Parameters
              </div>
              <div className="grid grid-cols-2 gap-2 text-on-surface-variant">
                <div>Project Type: <span className="text-on-surface font-semibold">{selectedLead.projectType || 'Construction'}</span></div>
                <div>Estimated Budget: <span className="text-on-surface font-semibold">{selectedLead.budget || selectedLead.estimatedBudget || 'N/A'}</span></div>
                {selectedLead.plotArea && <div>Plot Area: <span className="text-on-surface font-semibold">{selectedLead.plotArea} Sq.Ft</span></div>}
              </div>
            </div>

            {selectedLead.message && (
              <div className="space-y-1">
                <div className="font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">
                  Client Requirement Notes:
                </div>
                <div className="p-3 bg-surface-container text-xs text-on-surface leading-relaxed border border-outline-variant/20 whitespace-pre-line">
                  {selectedLead.message}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 text-xs font-label-caps bg-surface-container hover:bg-surface-container-high cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="Delete Lead Record">
          <div className="space-y-4 text-on-surface">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <p className="text-xs leading-relaxed font-body-md">
                Are you sure you want to delete this lead inquiry record? This operation cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 text-xs font-label-caps bg-surface-container hover:bg-surface-container-high cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-label-caps bg-error text-white font-bold hover:bg-error/80 cursor-pointer"
              >
                Delete Record Permanently
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
