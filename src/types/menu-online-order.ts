export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'in_delivery'
  | 'completed'
  | 'cancelled';

export type OrderDeliveryType = 'delivery' | 'pickup' | 'dine_in';

export interface CreateOrderItemDTO {
  productId: string;
  quantity: number;
  variationId?: string | null;
  modifierOptionIds?: string[];
  notes?: string;
}

export interface CreateOrderDTO {
  tenantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryType: OrderDeliveryType;
  deliveryAddress?: string;
  deliveryDistrict?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZip?: string;
  deliveryNumber?: string;
  deliveryComplement?: string;
  deliveryReference?: string;
  notes?: string;
  items: CreateOrderItemDTO[];
  cashbackUsed?: number;
}

export interface OrderItemModifierDTO {
  id: string;
  modifierName: string;
  optionName: string;
  priceDelta: number;
}

export interface OrderItemDTO {
  id: string;
  productId: string;
  nameSnapshot: string;
  basePrice: number;
  variationId: string | null;
  variationName: string | null;
  variationPrice: number | null;
  quantity: number;
  total: number;
  notes: string | null;
  modifiers: OrderItemModifierDTO[];
}

export interface OrderDTO {
  id: string;
  publicOrderCode: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  cashbackUsed: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryType: OrderDeliveryType;
  deliveryAddress: string | null;
  deliveryDistrict: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  deliveryZip: string | null;
  deliveryNumber: string | null;
  deliveryComplement: string | null;
  deliveryReference: string | null;
  notes: string | null;
  items: OrderItemDTO[];
  createdAt: Date;
  updatedAt: Date;
}
