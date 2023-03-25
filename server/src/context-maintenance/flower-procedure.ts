import { z } from "zod";
import { FlowerId, CreateFlowerInput, UpdateFlowerInput } from "./flower-schema";
import { adminProcedure, notFoundError } from "../trpc/initialize";

/**
 * 花の一覧を取得する
 */
export const getFlowers = adminProcedure.query(async ({ ctx }) => {
  return await ctx.prisma.flower.findMany();
});

/**
 * 花を取得する
 */
export const getFlower = adminProcedure.input(z.object({ id: FlowerId })).query(async ({ ctx, input }) => {
  const flower = await ctx.prisma.flower.findUnique({ where: { id: input.id } });
  if (flower === null) throw notFoundError;

  return flower;
});

/**
 * 花を登録する
 */
export const createFlower = adminProcedure.input(CreateFlowerInput).mutation(async ({ ctx, input }) => {
  const flower = await ctx.prisma.flower.create({ data: input });

  return flower;
});

/**
 * 花を更新する
 */
export const updateFlower = adminProcedure.input(UpdateFlowerInput).mutation(async ({ ctx, input }) => {
  const updatedFlower = await ctx.prisma.flower.update({
    where: { id: input.id },
    data: input,
  });

  return updatedFlower;
});

/**
 * 花を削除する
 */
export const deleteFlower = adminProcedure.mutation(() => {});
