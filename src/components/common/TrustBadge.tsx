import React from 'react';
import { Star, ShieldCheck, ShieldAlert, User, Briefcase, CheckCircle2 } from 'lucide-react';
import { ListerType } from '../../types';

export const RatingStars: React.FC<{ rating: number; reviewCount?: number; size?: 'sm' | 'md' }> = ({
  rating,
  reviewCount,
  size = 'sm',
}) => {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-1">
      <Star className={`${iconSize} fill-amber-400 text-amber-400`} />
      <span className={`font-semibold text-slate-800 dark:text-slate-200 ${textSize}`}>
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className={`text-slate-400 dark:text-slate-500 ${textSize}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

export const TrustBadge: React.FC<{ isVerified: boolean; text?: string; compact?: boolean }> = ({
  isVerified,
  text,
  compact = false,
}) => {
  if (compact) {
    return isVerified ? (
      <span
        title="RentEase Verified Property/Asset: Government identity and physical documentation verified"
        className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40"
      >
        <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
        <span>Verified</span>
      </span>
    ) : (
      <span
        title="Pending Platform Verification"
        className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      >
        <ShieldAlert className="h-3 w-3 text-slate-400" />
        <span>Pending</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
        isVerified
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60'
          : 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      }`}
    >
      <ShieldCheck className={`h-4 w-4 ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
      <span>{text || (isVerified ? 'Verified Listing' : 'Under Review')}</span>
    </div>
  );
};

export const OwnerBrokerBadge: React.FC<{ listerType: ListerType }> = ({ listerType }) => {
  const isOwner = listerType === 'OWNER';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold shadow-2xs ${
        isOwner
          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/70 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50'
          : 'bg-purple-50 text-purple-700 border border-purple-200/70 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/50'
      }`}
      title={
        isOwner
          ? 'Direct Owner Listing: Zero brokerage / deal directly with property owner'
          : 'Verified Broker Listing: Certified real-estate professional with platform compliance guarantee'
      }
    >
      {isOwner ? <User className="h-3 w-3" /> : <Briefcase className="h-3 w-3" />}
      <span>{isOwner ? 'Direct Owner' : 'Verified Broker'}</span>
    </span>
  );
};
