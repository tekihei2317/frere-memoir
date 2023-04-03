import { prisma } from "../prisma";

async function findFlowerByName(name: string) {
  return prisma.flower.findFirstOrThrow({ where: { name } });
}

export async function bouquetSeeder() {
  const [rose, carnation, lily, gerbera, sunflower, thistle, tulip, hydrangea, anemone, clematis] = await Promise.all([
    findFlowerByName("ローズ"),
    findFlowerByName("カーネーション"),
    findFlowerByName("リリー"),
    findFlowerByName("ガーベラ"),
    findFlowerByName("サンフラワー"),
    findFlowerByName("タルト"),
    findFlowerByName("チューリップ"),
    findFlowerByName("アジサイ"),
    findFlowerByName("アネモネ"),
    findFlowerByName("クレマチス"),
  ]);

  await Promise.all([
    prisma.bouquet.create({
      data: {
        bouquetCode: "RO001",
        name: "ロマンティックブーケ",
        bouquetDetails: {
          createMany: {
            data: [
              { flowerId: rose.id, flowerQuantity: 3 },
              { flowerId: lily.id, flowerQuantity: 3 },
            ],
          },
        },
      },
    }),
    prisma.bouquet.create({
      data: {
        bouquetCode: "HA001",
        name: "春の庭園",
        bouquetDetails: {
          createMany: {
            data: [
              { flowerId: tulip.id, flowerQuantity: 3 },
              { flowerId: hydrangea.id, flowerQuantity: 2 },
              { flowerId: anemone.id, flowerQuantity: 3 },
            ],
          },
        },
      },
    }),
    prisma.bouquet.create({
      data: {
        bouquetCode: "YO001",
        name: "陽気な日々",
        bouquetDetails: {
          createMany: {
            data: [
              { flowerId: gerbera.id, flowerQuantity: 3 },
              { flowerId: sunflower.id, flowerQuantity: 3 },
            ],
          },
        },
      },
    }),
    prisma.bouquet.create({
      data: {
        bouquetCode: "EL001",
        name: "エレガントな贈り物",
        bouquetDetails: {
          createMany: {
            data: [
              { flowerId: carnation.id, flowerQuantity: 3 },
              { flowerId: clematis.id, flowerQuantity: 3 },
            ],
          },
        },
      },
    }),
    prisma.bouquet.create({
      data: {
        bouquetCode: "CO001",
        name: "カラフルな祝福",
        bouquetDetails: {
          createMany: {
            data: [
              { flowerId: thistle.id, flowerQuantity: 3 },
              { flowerId: gerbera.id, flowerQuantity: 3 },
              { flowerId: sunflower.id, flowerQuantity: 3 },
              { flowerId: lily.id, flowerQuantity: 2 },
            ],
          },
        },
      },
    }),
  ]);
}
