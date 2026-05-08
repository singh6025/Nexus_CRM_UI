export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  commodityName: string;
  grade: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  farmerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  logisticsPartner: string;
  trackingNumber: string;
  expectedDelivery: string;
  actualDelivery: string | null;
  podUrl: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  buyerId: string;
  items: OrderItem[];
  logisticsPartner: string;
  expectedDelivery: string;
  notes?: string;
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {}

export interface StatusConfig {
  id: OrderStatus;
  label: string;
  color: string;
  icon: string;
}

export const STATUS_CONFIGS: StatusConfig[] = [
  { id: 'pending',    label: 'Pending',    color: '#78909c', icon: 'schedule' },
  { id: 'confirmed',  label: 'Confirmed',  color: '#1565c0', icon: 'check_circle' },
  { id: 'processing', label: 'Processing', color: '#e65100', icon: 'autorenew' },
  { id: 'dispatched', label: 'Dispatched', color: '#6a1b9a', icon: 'local_shipping' },
  { id: 'delivered',  label: 'Delivered',  color: '#2e7d32', icon: 'inventory_2' },
  { id: 'cancelled',  label: 'Cancelled',  color: '#c62828', icon: 'cancel' },
];

export const ACTIVE_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'dispatched', 'delivered',
];
