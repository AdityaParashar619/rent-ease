import React, { useState, useEffect } from 'react';
import { verificationService, disputeService } from '../services/platformServices';
import { VerificationItem, Dispute } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Scale,
  Users,
  Building,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { LAUNCH_CITY } from '../constants';

export const AdminDashboardPage: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [activeTab, setActiveTab] = useState<'verifications' | 'disputes' | 'analytics'>('verifications');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  useEffect(() => {
    const loadAdminData = async () => {
      const vRes = await verificationService.getVerifications();
      if (vRes.success && vRes.data) setVerifications(vRes.data);

      const dRes = await disputeService.getDisputes();
      if (dRes.success && dRes.data) setDisputes(dRes.data);
    };
    loadAdminData();
  }, []);

  const handleVerifyStatus = async (id: string, status: VerificationItem['status']) => {
    const res = await verificationService.updateVerification(id, status);
    if (res.success && res.data) {
      setVerifications((prev) => prev.map((v) => (v.id === id ? res.data! : v)));
      alert(`Asset verification status updated to ${status}. Badge updated across marketplace.`);
    }
  };

  const handleResolveDispute = (disputeId: string, resolution: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: 'RESOLVED',
              timeline: [
                ...d.timeline,
                {
                  title: 'Dispute Resolved by Admin Desk',
                  timestamp: 'Just now',
                  by: 'Platform Mediator',
                  description: resolution,
                },
              ],
            }
          : d
      )
    );
    setSelectedDispute(null);
    alert('Dispute marked as RESOLVED. Escrow funds transferred.');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Scale className="h-3.5 w-3.5" />
              <span>Trust, Compliance & Mediation Console</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
              Platform Administration & Dispute Desk
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review property title deeds, solve deposit conflicts, and maintain 100% marketplace transparency.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Marketplace City: {LAUNCH_CITY}
            </span>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Pending Verification Queue</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-slate-900 dark:text-white">
                {verifications.filter((v) => v.status === 'PENDING').length}
              </span>
              <span className="text-xs font-bold text-amber-600">Requires Audit</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Active Disputes</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-rose-600 dark:text-rose-400">
                {disputes.filter((d) => d.status !== 'RESOLVED').length}
              </span>
              <span className="text-xs font-medium text-slate-500">In Mediation</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Verified Marketplace Trust</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
                98.4%
              </span>
              <span className="text-xs font-bold text-emerald-600">Compliant</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-400">Total Escrow Funds</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display text-2xl font-black text-indigo-600 dark:text-indigo-400">
                ₹18.4L
              </span>
              <span className="text-xs font-medium text-slate-500">Secured in Bank</span>
            </div>
          </div>
        </div>

        {/* ADMIN TABS */}
        <div className="mt-8 flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold space-x-4">
          <button
            onClick={() => setActiveTab('verifications')}
            className={`flex items-center gap-2 border-b-2 py-3 px-2 transition ${
              activeTab === 'verifications'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="h-4 w-4" />
            <span>KYC & Asset Title Verification Queue ({verifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('disputes')}
            className={`flex items-center gap-2 border-b-2 py-3 px-2 transition ${
              activeTab === 'disputes'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Dispute & Mediation Desk ({disputes.length})</span>
          </button>
        </div>

        {/* TAB 1: VERIFICATION QUEUE */}
        {activeTab === 'verifications' && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4">
              Pending Title Deed & Ownership Document Reviews
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                  <th className="py-2.5 px-3">Asset Title</th>
                  <th className="py-2.5 px-3">Lister Name</th>
                  <th className="py-2.5 px-3">Document Type</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Updated</th>
                  <th className="py-2.5 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {verifications.map((v) => (
                  <tr key={v.id}>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {v.listingTitle}
                      </div>
                      <div className="text-[11px] text-slate-400">{v.listingId}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {v.listerName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {v.documentType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          v.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : v.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{v.lastUpdated}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {v.status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleVerifyStatus(v.id, 'VERIFIED')}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approve</span>
                          </button>
                        )}
                        {v.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleVerifyStatus(v.id, 'REJECTED')}
                            className="flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: DISPUTES DESK */}
        {activeTab === 'disputes' && (
          <div className="mt-6 space-y-4">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {d.id}
                      </span>
                      <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {d.status}
                      </span>
                      <span className="text-xs text-slate-400">• Booking: {d.bookingId}</span>
                    </div>
                    <h4 className="mt-1 font-bold text-slate-900 dark:text-white text-sm">
                      {d.subject}
                    </h4>
                  </div>

                  <div className="text-xs text-slate-500">
                    Filed on {d.createdAt} by {d.customerName}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 p-3 rounded-xl dark:bg-slate-800/60">
                      <span className="font-semibold text-slate-900 dark:text-white block mb-1">Customer Statement:</span>
                      {d.description}
                    </p>
                    <div className="text-slate-500">
                      Asset: <span className="font-medium text-slate-800 dark:text-slate-200">{d.listingTitle}</span>
                    </div>
                    <div className="text-slate-500">
                      Provider: <span className="font-medium text-slate-800 dark:text-slate-200">{d.providerName}</span>
                    </div>
                  </div>

                  {/* Timeline & Mediation Actions */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      Mediation Audit Log:
                    </h5>
                    <div className="space-y-2 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                      {d.timeline.map((item, idx) => (
                        <div key={idx} className="text-[11px]">
                          <div className="font-semibold text-slate-800 dark:text-slate-300">
                            {item.title} ({item.timestamp})
                          </div>
                          <div className="text-slate-500">{item.description}</div>
                        </div>
                      ))}
                    </div>

                    {d.status !== 'RESOLVED' && (
                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleResolveDispute(
                              d.id,
                              'Refund of security deposit full amount approved and processed directly to customer UPI ID.'
                            )
                          }
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Enforce Full Deposit Refund
                        </button>
                        <button
                          onClick={() =>
                            handleResolveDispute(
                              d.id,
                              'Provider repair quote verified. 50% deposit release approved to provider with customer consent.'
                            )
                          }
                          className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900 dark:bg-slate-700"
                        >
                          Settle Split Release
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
