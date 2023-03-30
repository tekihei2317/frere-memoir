import { protectedProcedure } from "../trpc/initialize";

export const getUser = protectedProcedure.query(({ ctx }) => {
  return ctx.session.user;
});
