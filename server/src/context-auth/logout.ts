import { protectedProcedure } from "../trpc/initialize";

export const logout = protectedProcedure.mutation(async ({ ctx }) => {
  ctx.session.user = undefined;
  await ctx.session.save();
});
