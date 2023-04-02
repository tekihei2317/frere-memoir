import { PrismaClient, Prisma } from "@prisma/client";

export const prismaClient = new PrismaClient();

type PaginationResult<T, A> = {
  items: Prisma.Result<T, A, "findMany">;
  count: number;
  pageCount: number;
};

export const prisma = prismaClient.$extends({
  model: {
    $allModels: {
      async paginate<T, A>(
        this: T,
        args: Prisma.Exact<A, Prisma.Args<T, "findMany">> & {
          page: number;
          perPage: number;
        }
      ): Promise<PaginationResult<T, A>> {
        const { page, perPage, ...findManyArgs } = args as any;

        const [items, count] = await Promise.all([
          (this as any).findMany({
            ...findManyArgs,
            skip: perPage * (page - 1),
            take: perPage,
          }),
          (this as any).count({ where: (args as any).where }),
        ]);
        const pageCount = Math.ceil(count / perPage);

        return { items, count, pageCount };
      },
    },
  },
});
