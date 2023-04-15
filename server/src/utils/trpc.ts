import { notFoundError } from "../trpc/initialize";

export function throwNotFoundErrorIfNull<T>(model: T | null): asserts model is T {
  if (model === null) throw notFoundError;
}
