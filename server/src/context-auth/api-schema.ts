import { z } from "zod";

export const AdminLoginInput = z.object({
  type: z.literal("admin"),
  email: z.string().email(),
  password: z.string().min(1),
});

const CustomerLoginInput = z.object({
  type: z.literal("customer"),
  email: z.string().email(),
  password: z.string(),
});

export const LoginInput = z.discriminatedUnion("type", [AdminLoginInput, CustomerLoginInput]);
export type LoginInput = z.infer<typeof LoginInput>;

export const RegisterInput = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterInput>;

export type { FrereUser } from "./core/types";
