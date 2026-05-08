export type OpportunityStage =
  | 'prospecting'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Opportunity {
  id: string;
  name: string;
  company: string;
  dealValue: number;
  stage: OpportunityStage;
  probability: number;
  assignedTo: string;
  expectedCloseDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpportunityRequest {
  name: string;
  company: string;
  dealValue: number;
  stage: OpportunityStage;
  probability: number;
  assignedTo: string;
  expectedCloseDate: string;
  notes?: string;
}

export interface UpdateOpportunityRequest extends Partial<CreateOpportunityRequest> {}

export interface StageConfig {
  id: OpportunityStage;
  label: string;
  color: string;
}

export const STAGE_CONFIGS: StageConfig[] = [
  { id: 'prospecting',   label: 'Prospecting',   color: '#78909c' },
  { id: 'qualification', label: 'Qualification',  color: '#1565c0' },
  { id: 'proposal',      label: 'Proposal',       color: '#e65100' },
  { id: 'negotiation',   label: 'Negotiation',    color: '#6a1b9a' },
  { id: 'closed_won',    label: 'Closed Won',     color: '#2e7d32' },
  { id: 'closed_lost',   label: 'Closed Lost',    color: '#c62828' },
];
