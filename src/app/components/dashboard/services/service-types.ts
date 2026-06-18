import { LucideIcon } from 'lucide-react';
import {
  Truck, Sparkles, Paintbrush, ShieldCheck, Zap, Wrench,
} from 'lucide-react';

export type ServiceCategoryId =
  | 'moving'
  | 'cleaning'
  | 'painter'
  | 'security'
  | 'electrician'
  | 'plumber';

export type ServiceRequestStatus =
  | 'awaiting_bids'
  | 'awaiting_inspection'
  | 'in_escrow'
  | 'work_complete'
  | 'completed'
  | 'disputed';

export interface ServiceCategory {
  id: ServiceCategoryId;
  label: string;
  icon: LucideIcon;
  tagline: string;
  priority: 'high' | 'secondary';
  /** Whether the request requires a physical inspection bid before scope of work is locked */
  requiresInspection: boolean;
  /** Theme accents (Tailwind classes) */
  accent: { from: string; to: string; iconBg: string; icon: string };
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'moving',
    label: 'Moving',
    icon: Truck,
    tagline: 'Pack, transport & set up your new home',
    priority: 'high',
    requiresInspection: false,
    accent: { from: 'from-amber-50', to: 'to-orange-50', iconBg: 'bg-amber-100', icon: 'text-amber-600' },
  },
  {
    id: 'cleaning',
    label: 'Professional Cleaning',
    icon: Sparkles,
    tagline: 'Deep clean before you unpack a single box',
    priority: 'high',
    requiresInspection: false,
    accent: { from: 'from-sky-50', to: 'to-blue-50', iconBg: 'bg-sky-100', icon: 'text-sky-600' },
  },
  {
    id: 'painter',
    label: 'Painter',
    icon: Paintbrush,
    tagline: 'Touch-ups & full repaints',
    priority: 'secondary',
    requiresInspection: true,
    accent: { from: 'from-violet-50', to: 'to-purple-50', iconBg: 'bg-violet-100', icon: 'text-violet-600' },
  },
  {
    id: 'security',
    label: 'Security',
    icon: ShieldCheck,
    tagline: 'CCTV, alarms & guards',
    priority: 'secondary',
    requiresInspection: true,
    accent: { from: 'from-emerald-50', to: 'to-green-50', iconBg: 'bg-emerald-100', icon: 'text-emerald-600' },
  },
  {
    id: 'electrician',
    label: 'Electrician',
    icon: Zap,
    tagline: 'Sockets, wiring, fuse boxes',
    priority: 'secondary',
    requiresInspection: true,
    accent: { from: 'from-yellow-50', to: 'to-amber-50', iconBg: 'bg-yellow-100', icon: 'text-yellow-600' },
  },
  {
    id: 'plumber',
    label: 'Plumber',
    icon: Wrench,
    tagline: 'Leaks, taps, water systems',
    priority: 'secondary',
    requiresInspection: true,
    accent: { from: 'from-cyan-50', to: 'to-teal-50', iconBg: 'bg-cyan-100', icon: 'text-cyan-600' },
  },
];

// ─── Form payload types ────────────────────────────────────────────────────────

export type BudgetMode = 'fixed' | 'bid';

export interface MovingFormData {
  pickupLocation: string;
  destination: string;
  inventory: string[]; // e.g. ['Bed', 'Sofa', 'Fridge']
  floorLevel: string;
  liftAvailable: 'yes' | 'no' | null;
  /** Mandatory photo/video count of the items to move */
  mediaCount: number;
  /** Mandatory budget in Naira (string for input UX) */
  budget: string;
}

export interface GeneralFormData {
  description: string;
  mediaCount: number; // mock — count of uploaded images
  budgetMode: BudgetMode;
  fixedBudget?: string;
}

export type ServiceFormData =
  | { type: 'moving'; data: MovingFormData }
  | { type: 'general'; data: GeneralFormData };

// ─── Bids ──────────────────────────────────────────────────────────────────────

export interface ServiceBid {
  id: number;
  proName: string;
  proAvatar?: string;
  rating: number;
  jobsCompleted: number;
  /** For inspection-required services this is the diagnosis fee; otherwise the full job bid */
  amount: number;
  amountLabel: string; // 'Physical Inspection/Diagnosis Fee' or 'Total Job'
  eta: string; // e.g. 'Today, 4-6pm'
  note?: string;
}

// ─── Service Request ───────────────────────────────────────────────────────────

export interface ServiceRequest {
  id: number;
  category: ServiceCategoryId;
  propertyTitle: string;
  createdAt: string;
  status: ServiceRequestStatus;
  bids: ServiceBid[];
  acceptedBidId?: number;
  /** Funds locked in escrow once a bid is accepted */
  escrowAmount?: number;
  /** Set when work is marked complete by the pro — drives the 48h gate */
  workCompletedAt?: number; // epoch ms
  form: ServiceFormData;
}

export const STATUS_CONFIG: Record<
  ServiceRequestStatus,
  { label: string; chip: string; dot: string }
> = {
  awaiting_bids: {
    label: 'Awaiting Bids',
    chip: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  awaiting_inspection: {
    label: 'Awaiting Inspection',
    chip: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  in_escrow: {
    label: 'In Escrow',
    chip: 'bg-[hsl(var(--escrow-green-muted))] text-[hsl(var(--escrow-green))] border-[hsl(var(--escrow-green))]/20',
    dot: 'bg-[hsl(var(--escrow-green))]',
  },
  work_complete: {
    label: 'Work Complete — Verify',
    chip: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
  },
  completed: {
    label: 'Completed',
    chip: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
  disputed: {
    label: 'Disputed',
    chip: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-[hsl(var(--escrow-red))]',
  },
};

// ─── Mock seed data ────────────────────────────────────────────────────────────

const now = Date.now();

export const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
  {
    id: 1001,
    category: 'cleaning',
    propertyTitle: '2 Bed Serviced Apartment, Victoria Island',
    createdAt: '2 hours ago',
    status: 'awaiting_bids',
    bids: [
      { id: 1, proName: 'Sparkle Pro Cleaners', rating: 4.9, jobsCompleted: 312, amount: 65000, amountLabel: 'Final Project Cost', eta: 'Tomorrow, 9am-1pm' },
      { id: 2, proName: 'Bisi Adekunle', rating: 4.7, jobsCompleted: 84, amount: 48000, amountLabel: 'Final Project Cost', eta: 'Today, 4-7pm' },
      { id: 3, proName: 'CleanHouse NG', rating: 4.8, jobsCompleted: 156, amount: 72000, amountLabel: 'Final Project Cost', eta: 'Sat, 10am-2pm', note: 'Includes deep oven & fridge clean' },
      { id: 4, proName: 'Mara Services', rating: 4.6, jobsCompleted: 49, amount: 55000, amountLabel: 'Final Project Cost', eta: 'Tomorrow, 12pm' },
      { id: 5, proName: 'PristineHome', rating: 4.9, jobsCompleted: 201, amount: 80000, amountLabel: 'Final Project Cost', eta: 'Mon, 9am' },
      { id: 6, proName: 'GreenClean Lagos', rating: 4.5, jobsCompleted: 38, amount: 42000, amountLabel: 'Final Project Cost', eta: 'Today, 6pm' },
    ],
    form: {
      type: 'general',
      data: { description: 'Full deep clean before move-in. 2 bed, 2 bath, kitchen.', mediaCount: 0, budgetMode: 'bid' },
    },
  },
  {
    id: 1002,
    category: 'electrician',
    propertyTitle: '2 Bed Serviced Apartment, Victoria Island',
    createdAt: '1 day ago',
    status: 'in_escrow',
    acceptedBidId: 11,
    escrowAmount: 15000,
    bids: [
      { id: 11, proName: 'Tunde Bello', rating: 4.8, jobsCompleted: 167, amount: 15000, amountLabel: 'Inspection & Diagnosis', eta: 'Today, 3pm' },
    ],
    form: {
      type: 'general',
      data: { description: 'Burnt socket in living room, fuse trips when AC is on.', mediaCount: 2, budgetMode: 'bid' },
    },
  },
  {
    id: 1003,
    category: 'moving',
    propertyTitle: '2 Bed Serviced Apartment, Victoria Island',
    createdAt: '3 days ago',
    status: 'work_complete',
    acceptedBidId: 21,
    escrowAmount: 180000,
    workCompletedAt: now - 6 * 60 * 60 * 1000, // 6h ago → ~42h left on the gate
    bids: [
      { id: 21, proName: 'SwiftMove Logistics', rating: 4.9, jobsCompleted: 540, amount: 180000, amountLabel: 'Final Project Cost', eta: 'Completed' },
    ],
    form: {
      type: 'moving',
      data: {
        pickupLocation: '14 Adeola Odeku, VI',
        destination: '2 Bed Serviced Apartment, Victoria Island',
        inventory: ['Bed', 'Sofa', 'Fridge', 'TV', 'Wardrobe'],
        floorLevel: '4th',
        liftAvailable: 'yes',
        mediaCount: 3,
        budget: '200,000',
      },
    },
  },
];
