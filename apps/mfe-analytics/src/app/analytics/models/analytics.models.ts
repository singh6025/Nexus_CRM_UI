export interface RevenueTrend {
  period:   string;
  revenue:  number;
  orders:   number;
}

export interface FunnelStage {
  stage:          string;
  count:          number;
  value:          number;
  conversionRate: number;
}

export interface SupplyDemandRow {
  commodityId: string;
  name:        string;
  supplyKg:    number;
  demandKg:    number;
  variance:    number;
}

export interface TopCommodity {
  name:    string;
  revenue: number;
}

export interface AnalyticsDashboard {
  totalRevenue:     number;
  revenueGrowthPct: number;
  totalOrders:      number;
  activeLeads:      number;
  conversionRate:   number;
  avgDealSize:      number;
  revenueTrends:    RevenueTrend[];
  funnelStages:     FunnelStage[];
  topCommodities:   TopCommodity[];
}
