export type FarmerStatus = 'active' | 'inactive' | 'onboarding' | 'suspended';
export type LandUnit = 'acres' | 'hectares';

export interface CommodityLink {
  commodityId: string;
  commodityName: string;
  grade: string;
  annualSupplyKg: number;
  lastSupplyDate: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  village: string;
  district: string;
  state: string;
  landSize: number;
  landUnit: LandUnit;
  status: FarmerStatus;
  assignedAgentId: string;
  assignedAgentName: string;
  commodities: CommodityLink[];
  totalSupplyKg: number;
  totalRevenueGenerated: number;
  onboardedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerFilters {
  search?: string;
  status?: FarmerStatus;
  district?: string;
  commodity?: string;
  page?: number;
  size?: number;
}

export interface CreateFarmerRequest {
  name: string;
  phone: string;
  email: string;
  village: string;
  district: string;
  state: string;
  landSize: number;
  landUnit: LandUnit;
  assignedAgentId: string;
}

export interface UpdateFarmerRequest extends Partial<CreateFarmerRequest> {
  status?: FarmerStatus;
}

export const STATUS_CONFIG: Record<FarmerStatus, { label: string; color: string }> = {
  active:      { label: 'Active',      color: '#2e7d32' },
  inactive:    { label: 'Inactive',    color: '#78909c' },
  onboarding:  { label: 'Onboarding', color: '#e65100' },
  suspended:   { label: 'Suspended',  color: '#c62828' },
};
