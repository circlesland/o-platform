export type ShoppingCartItem = {
  offerId: number;
  shopId: number;
  qty: number;
  total?: number;
  version: number;
  title?: string;
  pictureUrl?: string;
  description?: string;
  pricePerUnit?: number;
  sellerAddress?: string;
};
