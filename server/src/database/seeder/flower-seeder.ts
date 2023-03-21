import { prisma } from "../prisma";

type Flower = {
  name: string;
  flowerCode: string;
  maintanableDays: number;
  deliveryDays: number;
};

const flowers: Flower[] = [
  {
    name: "ローズ",
    flowerCode: "RO001",
    maintanableDays: 5,
    deliveryDays: 3,
  },
  {
    name: "カーネーション",
    flowerCode: "CA001",
    maintanableDays: 14,
    deliveryDays: 1,
  },
  {
    name: "リリー",
    flowerCode: "LI001",
    maintanableDays: 10,
    deliveryDays: 3,
  },
  {
    name: "ガーベラ",
    flowerCode: "GA001",
    maintanableDays: 10,
    deliveryDays: 2,
  },
  {
    name: "サンフラワー",
    flowerCode: "SA001",
    maintanableDays: 7,
    deliveryDays: 2,
  },
  {
    name: "タルト",
    flowerCode: "TA001",
    maintanableDays: 14,
    deliveryDays: 3,
  },
  {
    name: "チューリップ",
    flowerCode: "CH001",
    maintanableDays: 7,
    deliveryDays: 1,
  },
  {
    name: "アジサイ",
    flowerCode: "AJ001",
    maintanableDays: 14,
    deliveryDays: 3,
  },
  {
    name: "アネモネ",
    flowerCode: "AN001",
    maintanableDays: 7,
    deliveryDays: 2,
  },
  {
    name: "クレマチス",
    flowerCode: "CR001",
    maintanableDays: 7,
    deliveryDays: 3,
  },
];

export async function flowerSeeder() {
  await prisma.flower.createMany({
    data: flowers.map((flower) => ({
      ...flower,
      purchaseQuantity: 10,
    })),
  });
}
