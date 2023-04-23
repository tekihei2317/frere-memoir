import { notFoundError } from "../trpc/initialize";

export function throwNotFoundErrorIfNull<T>(model: T | null): T {
  if (model === null) throw notFoundError;
  return model;
}
