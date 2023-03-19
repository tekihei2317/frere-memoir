import { adminProcedure } from "../trpc/initialize";

/**
 * 花の一覧を取得する
 */
export const getFlowers = adminProcedure.query(async ({ ctx }) => {
  return await ctx.prisma.flower.findMany();
});

/**
 * 花を取得する
 */
export const getFlower = adminProcedure.query(() => {
  return {};
});

/**
 * 花を登録する
 */
export const createFlower = adminProcedure.mutation(() => {});

/**
 * 花を更新する
 */
export const updateFlower = adminProcedure.mutation(() => {});

/**
 * 花を削除する
 */
export const deleteFlower = adminProcedure.mutation(() => {});
