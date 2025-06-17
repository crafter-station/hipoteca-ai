import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function processInParallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
): Promise<R[]> {
  const promises = items.map(processor);
  return Promise.all(promises);
}
