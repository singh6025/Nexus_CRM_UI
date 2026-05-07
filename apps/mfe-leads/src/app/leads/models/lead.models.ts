export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type LeadSource = 'website' | 'referral' | 'cold_call' | 'social_media' | 'trade_show' | 'other';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: string;
  estimatedValue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  search?: string;
  status?: LeadStatus;
  source?: LeadSource;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateLeadRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo: string;
  estimatedValue: number;
  notes?: string;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'status_change';
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface FunnelStage {
  status: LeadStatus;
  label: string;
  count: number;
  value: number;
  color: string;
}
