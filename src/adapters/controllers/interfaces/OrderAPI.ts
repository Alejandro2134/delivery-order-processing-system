type OrderItems = {
  description: string;
  unitPrice: string;
  quantity: number;
};

export type OrderAPI = {
  clientId: number;
  restaurantId: number;
  items: OrderItems[];
};
