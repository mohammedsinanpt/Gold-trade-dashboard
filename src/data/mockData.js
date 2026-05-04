// src/data/mockData.js
// Shared data used by 2+ pages.
// Page-specific mock data lives in src/data/[page]MockData.js
// Delete this file last — only when ALL pages are on real APIs.

export const CLIENTS = [
  { id: 1, name: 'Hassan Al-Mahmoud', email: 'hassan@email.com', phone: '+971 50 123 4567', tier: 'HNI', status: 'Active', kyc: 'Approved', onboarding: 'Active', city: 'Dubai', nationality: 'UAE', ageGroup: '31–45', lang: 'Arabic/English', channel: 'Walk-in', clv: '$420k', avgSpend: '$84k', frequency: 'Monthly', lastContact: '2h ago', interest: '24K Bars', volume: '2.5 KG', dormant: false, notes: [] },
  { id: 2, name: 'Fatima Al-Zahra', email: 'fatima@email.com', phone: '+966 55 234 5678', tier: 'Corporate', status: 'Active', kyc: 'Approved', onboarding: 'Active', city: 'Riyadh', nationality: 'KSA', ageGroup: '46–60', lang: 'Arabic', channel: 'Phone', clv: '$1.2M', avgSpend: '$300k', frequency: 'Quarterly', lastContact: '1d ago', interest: 'Bullion', volume: '15 KG', dormant: false, notes: [] },
  { id: 3, name: 'John Stevens', email: 'john@email.com', phone: '+44 7911 123456', tier: 'Retail', status: 'Inactive', kyc: 'Pending', onboarding: 'KYC Pending', city: 'London', nationality: 'UK', ageGroup: '18–30', lang: 'English', channel: 'App', clv: '$85k', avgSpend: '$17k', frequency: 'Quarterly', lastContact: '12d ago', interest: 'Coins', volume: '0.5 KG', dormant: false, notes: [] },
  { id: 4, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', tier: 'HNI', status: 'Dormant', kyc: 'Approved', onboarding: 'Active', city: 'Mumbai', nationality: 'India', ageGroup: '31–45', lang: 'English/Hindi', channel: 'E-commerce', clv: '$210k', avgSpend: '$52k', frequency: 'Monthly', lastContact: '45d ago', interest: 'Jewellery', volume: '1.2 KG', dormant: true, notes: [] },
  { id: 5, name: 'Marcus Weber', email: 'marcus@email.com', phone: '+49 1511 234567', tier: 'Corporate', status: 'Active', kyc: 'Approved', onboarding: 'Active', city: 'Frankfurt', nationality: 'Germany', ageGroup: '46–60', lang: 'German/English', channel: 'Phone', clv: '$890k', avgSpend: '$178k', frequency: 'Monthly', lastContact: '3h ago', interest: '24K Bars', volume: '8 KG', dormant: false, notes: [] },
  { id: 6, name: 'Aisha Okonkwo', email: 'aisha@email.com', phone: '+234 80 345 6789', tier: 'Retail', status: 'Inactive', kyc: 'Registered', onboarding: 'Registered', city: 'Lagos', nationality: 'Nigeria', ageGroup: '18–30', lang: 'English', channel: 'App', clv: '$32k', avgSpend: '$8k', frequency: 'Quarterly', lastContact: '8d ago', interest: 'Coins', volume: '0.2 KG', dormant: false, notes: [] },
];

export const LEADS = [
  { id: 1, name: 'Ahmed Khalil',  source: 'Google Ads', status: 'New',       value: '$45k',  date: 'Today',     assigned: 'S. Abraham' },
  { id: 2, name: 'Sofia Rossi',   source: 'Referral',   status: 'Contacted', value: '$120k', date: 'Yesterday', assigned: 'J. Doe'     },
  { id: 3, name: 'David Chen',    source: 'Exhibition', status: 'Qualified', value: '$280k', date: '3d ago',    assigned: 'M. Smith'   },
  { id: 4, name: 'Nour Hassan',   source: 'WhatsApp',   status: 'Proposal',  value: '$65k',  date: '5d ago',    assigned: 'S. Abraham' },
  { id: 5, name: 'Raj Patel',     source: 'Walk-in',    status: 'New',       value: '$18k',  date: 'Today',     assigned: 'J. Doe'     },
];

export const INTERACTIONS = [
  { id: 1, client: 'Hassan Al-Mahmoud', type: 'Call',    date: '2h ago',  rep: 'S. Abraham', summary: 'Discussed 24K bar pricing for next shipment. Client interested in 2kg order.',  followUp: '2026-04-28' },
  { id: 2, client: 'Fatima Al-Zahra',  type: 'Meeting', date: '1d ago',  rep: 'J. Doe',     summary: 'Quarterly review of corporate account. Discussed bulk pricing terms.',           followUp: '2026-05-01' },
  { id: 3, client: 'Marcus Weber',      type: 'Email',   date: '3h ago',  rep: 'M. Smith',   summary: 'Sent updated quote for 8KG gold bars. Awaiting confirmation.',                  followUp: '2026-04-26' },
  { id: 4, client: 'John Stevens',      type: 'Call',    date: '12d ago', rep: 'S. Abraham', summary: 'Follow-up on pending KYC documents. Client said will submit this week.',         followUp: '2026-04-25' },
];

export const REMINDERS = [
  { id: 1, client: 'John Stevens',  type: 'KYC Follow-up',             due: 'Today',    priority: 'High',   rep: 'S. Abraham' },
  { id: 2, client: 'Priya Sharma',  type: 'Reactivation — Dormant 45d', due: 'Overdue',  priority: 'High',   rep: 'M. Smith'   },
  { id: 3, client: 'Aisha Okonkwo', type: 'KYC Document Chase',         due: 'Tomorrow', priority: 'Medium', rep: 'J. Doe'     },
  { id: 4, client: 'Sofia Rossi',   type: 'Quote Follow-up',            due: 'Apr 26',   priority: 'Medium', rep: 'S. Abraham' },
];

export const ALERTS = [
  { id: 1, text: 'Fatima Al-Zahra KYC approved — ready to trade',       type: 'kyc',     time: '1h ago'  },
  { id: 2, text: 'Priya Sharma inactive for 45 days — dormant risk',    type: 'dormant', time: '3h ago'  },
  { id: 3, text: 'John Stevens KYC documents submitted for review',     type: 'kyc',     time: '5h ago'  },
  { id: 4, text: 'New lead from Google Ads — Ahmed Khalil assigned',    type: 'lead',    time: '12h ago' },
];

export const revData = [
  { n: 'Jan', v: 3200 }, { n: 'Feb', v: 4100 }, { n: 'Mar', v: 3800 },
  { n: 'Apr', v: 5200 }, { n: 'May', v: 4700 }, { n: 'Jun', v: 6100 },
  { n: 'Jul', v: 5500 }, { n: 'Aug', v: 7200 }, { n: 'Sep', v: 6800 },
  { n: 'Oct', v: 8100 }, { n: 'Nov', v: 7600 }, { n: 'Dec', v: 9200 },
];

export const pipelineData = [
  { stage: 'Enquiry',       count: 84, value: '$12.4M', color: '#818CF8' },
  { stage: 'Quote Sent',    count: 56, value: '$8.9M',  color: '#6366F1' },
  { stage: 'Negotiation',   count: 31, value: '$6.2M',  color: '#4F46E5' },
  { stage: 'Verbal Commit', count: 18, value: '$4.8M',  color: '#3730A3' },
  { stage: 'Closed Won',    count: 9,  value: '$2.1M',  color: '#312E81' },
];

export const TOP_CLIENTS = [
  { rank: 1, name: 'Fatima Al-Zahra',   city: 'Riyadh',    tier: 'Corporate', revenue: '$1.2M', txCount: 4, lastTx: '1d ago'  },
  { rank: 2, name: 'Marcus Weber',       city: 'Frankfurt', tier: 'Corporate', revenue: '$890k', txCount: 5, lastTx: '3h ago'  },
  { rank: 3, name: 'Hassan Al-Mahmoud', city: 'Dubai',     tier: 'HNI',       revenue: '$420k', txCount: 5, lastTx: '2h ago'  },
  { rank: 4, name: 'Priya Sharma',       city: 'Mumbai',    tier: 'HNI',       revenue: '$210k', txCount: 4, lastTx: '45d ago' },
  { rank: 5, name: 'John Stevens',       city: 'London',    tier: 'Retail',    revenue: '$85k',  txCount: 5, lastTx: '12d ago' },
  { rank: 6, name: 'Aisha Okonkwo',      city: 'Lagos',     tier: 'Retail',    revenue: '$32k',  txCount: 4, lastTx: '8d ago'  },
];