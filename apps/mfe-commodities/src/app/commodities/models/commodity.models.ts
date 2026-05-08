export type CommodityGrade    = 'premium' | 'A' | 'B' | 'C';
export type CommodityCategory = 'grain' | 'vegetable' | 'fruit' | 'spice' | 'oilseed' | 'pulse';

export interface MandiPrice {
  mandiName:  string;
  state:      string;
  minPrice:   number;
  maxPrice:   number;
  modalPrice: number;
  date:       string;
}

export interface PriceTrend {
  date:  string;
  price: number;
}

export interface Commodity {
  id:             string;
  name:           string;
  category:       CommodityCategory;
  grade:          CommodityGrade;
  unit:           string;
  currentPrice:   number;
  priceChangePct: number;
  weeklyHigh:     number;
  weeklyLow:      number;
  mandiPrices:    MandiPrice[];
  priceTrends:    PriceTrend[];
  totalSupplyKg:  number;
  activeOrders:   number;
  createdAt:      string;
  updatedAt:      string;
}

export interface CreateCommodityRequest {
  name:         string;
  category:     CommodityCategory;
  grade:        CommodityGrade;
  unit:         string;
  currentPrice: number;
}

export type UpdateCommodityRequest = Partial<CreateCommodityRequest>;

export const CATEGORY_CONFIG: Record<CommodityCategory, { label: string; variant: string }> = {
  grain:     { label: 'Grain',     variant: 'info'    },
  vegetable: { label: 'Vegetable', variant: 'success' },
  fruit:     { label: 'Fruit',     variant: 'warning' },
  spice:     { label: 'Spice',     variant: 'danger'  },
  oilseed:   { label: 'Oilseed',  variant: 'neutral' },
  pulse:     { label: 'Pulse',     variant: 'info'    },
};

export const GRADE_CONFIG: Record<CommodityGrade, { label: string; variant: string }> = {
  premium: { label: 'Premium', variant: 'info'    },
  A:       { label: 'Grade A', variant: 'success' },
  B:       { label: 'Grade B', variant: 'warning' },
  C:       { label: 'Grade C', variant: 'neutral' },
};
