import React, { useState } from 'react';

export const PolicyPage: React.FC<{ defaultTab?: 'cancellation' | 'refund' | 'terms' | 'privacy' }> = ({
  defaultTab = 'cancellation',
}) => {
  const [tab, setTab] = useState<'cancellation' | 'refund' | 'terms' | 'privacy'>(defaultTab);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-6">
          Legal & Compliance Documentation
        </h1>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold space-x-4 mb-6">
          {[
            { id: 'cancellation', label: 'Cancellation Policy' },
            { id: 'refund', label: 'Refund & Escrow Policy' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'privacy', label: 'Privacy Policy' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`border-b-2 py-2.5 px-2 transition ${
                tab === item.id
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed">
          {tab === 'cancellation' && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Cancellation Policy</h2>
              <p>
                RentEase provides standardized cancellation windows across categories to maintain fairness for both renters and asset owners:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Residential Long-term Rentals:</strong> Renters can cancel within 48 hours of booking confirmation for a 100% refund of the security deposit and token rent, provided the move-in date is at least 7 days away.
                </li>
                <li>
                  <strong>Self-Drive Vehicles:</strong> Full refund if cancelled up to 24 hours prior to vehicle pickup time. Cancellations within 24 hours incur a flat 10% fee.
                </li>
                <li>
                  <strong>Event Venues & Banquet Lawns:</strong> Cancellations made 30 days prior to event date receive a 90% refund. Cancellations made 15–29 days prior receive a 50% refund.
                </li>
              </ul>
            </>
          )}

          {tab === 'refund' && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Refund & Escrow Policy</h2>
              <p>
                All security deposits are held in a Reserve Bank of India compliant escrow account managed under the RentEase Trust & Safety Protocol:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Deposit Return Speed:</strong> Upon checkout inspection approval by both parties, security deposits are automatically returned to the customer's UPI/bank account within 4 to 24 hours.
                </li>
                <li>
                  <strong>Dispute Mediation:</strong> In case of damage claims, funds remain frozen in escrow until the RentEase Mediation Desk reviews field inspection logs and photographic evidence. Neither party can arbitrarily seize funds.
                </li>
              </ul>
            </>
          )}

          {tab === 'terms' && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Terms of Service</h2>
              <p>
                By accessing RentEase on web, macOS, or Windows desktop, you agree to comply with all applicable local real-estate and rental regulations in Karnataka and India.
              </p>
              <p>
                Providers are legally responsible for holding legitimate title deed or vehicle registration authority. Misrepresentation of asset condition or impersonation of direct ownership is strictly prohibited.
              </p>
            </>
          )}

          {tab === 'privacy' && (
            <>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Privacy Policy</h2>
              <p>
                RentEase takes tenant privacy seriously:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Address Masking:</strong> Exact apartment numbers, villa gates, and vehicle registration plates are concealed from public search until booking escrow is authorized.
                </li>
                <li>
                  <strong>Encrypted KYC:</strong> Government identity documents (Aadhaar, PAN, DL) are stored using AES-256 bank-grade encryption with automated redaction of sensitive digits.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
