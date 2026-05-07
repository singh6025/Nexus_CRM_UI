export interface KpiData {
  totalLeads: number;
  totalLeadsDelta: number;
  openOpportunities: number;
  openOpportunitiesDelta: number;
  totalRevenue: number;
  totalRevenueDelta: number;
  ticketsOpen: number;
  ticketsOpenDelta: number;
}

export interface PipelineStage {
  stage: string;
  count: number;
  value: number;
  color: string;
}

export interface PipelineSummary {
  stages: PipelineStage[];
  totalValue: number;
  totalDeals: number;
}

export interface AlertItem {
  id: string;
  type: 'lead' | 'opportunity' | 'order' | 'ticket' | 'system';
  title: string;
  message: string;
  entityId: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardData {
  kpis: KpiData;
  pipeline: PipelineSummary;
  alerts: AlertItem[];
}
