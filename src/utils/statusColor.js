export const statusColor = (s) => {
  if (s === 'Active') return 'emerald';
  if (s === 'Inactive') return 'amber';
  if (s === 'Dormant') return 'rose';
  if (s === 'Approved') return 'emerald';
  if (s === 'Pending' || s === 'KYC Pending') return 'amber';
  if (s === 'Registered') return 'sky';
  return 'slate';
};