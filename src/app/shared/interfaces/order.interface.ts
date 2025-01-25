export interface Order {
  id: string;
  customerId: string;
  date: Date;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface OrderItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
