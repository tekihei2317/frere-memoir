import { appRouter } from "../trpc/trpc-router";
import { prisma } from "../database/prisma";
import { authenticationError, authorizationError } from "../trpc/initialize";
import { IronSession } from "iron-session";

describe("adminProcedure", () => {
  test("adminProcedureは、ログインしていないユーザーは使用できないこと", async () => {
    const caller = appRouter.createCaller({ prisma, session: {} as IronSession, user: undefined });

    await expect(caller.flowers()).rejects.toThrow(authenticationError);
  });

  test("adminProcedureは、顧客は使用できないこと", async () => {
    const caller = appRouter.createCaller({
      prisma,
      session: {} as IronSession,
      user: { id: 1, type: "customer", name: "customer", email: "customer@example.com" },
    });

    await expect(caller.flowers()).rejects.toThrow(authorizationError);
  });

  test("adminProcedureは、管理者は使用できること", async () => {
    const caller = appRouter.createCaller({
      prisma,
      session: {} as IronSession,
      user: { type: "admin", email: "admin@example.com" },
    });

    expect(await caller.flowers()).toBeDefined();
  });
});
