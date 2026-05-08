export type BuyerStatus = 'active' | 'inactive' | 'prospect' | 'churned';
export type BuyerTier   = 'platinum' | 'gold' | 'silver' | 'bronze';

export interface DealSummary {
  orderId: string;
  orderNumber: string;
  commodity: string;
  quantityKg: number;
  amount: number;
  date: string;
  status: string;
}

export interface Buyer {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  tier: BuyerTier;
  status: BuyerStatus;
  assignedAgentId: string;
  assignedAgentName: string;
  gmvAllTime: number;
  gmvCurrentYear: number;
  totalOrders: number;
  avgOrderValue: number;
  lastOrderDate: string | null;
  recentDeals: DealSummary[];
  gstNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuyerRequest {
  name: string;
  companyName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  tier: BuyerTier;
  assignedAgentId: string;
  gstNumber?: string;
}

export interface UpdateBuyerRequest extends Partial<CreateBuyerRequest> {
  status?: BuyerStatus;
}

export const STATUS_CONFIG: Record<BuyerStatus, { label: string; variant: string }> = {
  active:   { label: 'Active',   variant: 'success' },
  inactive: { label: 'Inactive', variant: 'neutral' },
  prospect: { label: 'Prospect', variant: 'info'    },
  churned:  { label: 'Churned',  variant: 'danger'  },
};

export const TIER_CONFIG: Record<BuyerTier, { label: string; color: string }> = {
  platinum: { label: 'Platinum', color: '#5c6bc0' },
  gold:     { label: 'Gold',     color: '#f9a825' },
  silver:   { label: 'Silver',   color: '#78909c' },
  bronze:   { label: 'Bronze',   color: '#8d6e63' },
};
