export type Flower = {
  id: number;
  flowerCode: string;
  name: string;
  deliveryDays: number;
  purchaseQuantity: number;
  maintanableDays: number;
};

type BouquetDetail = {
  id: number;
  flowerQuantity: number;
  flower: Flower;
};

export type Bouquet = {
  id: number;
  bouquetCode: string;
  name: string;
  bouquetDetails: BouquetDetail[];
};
