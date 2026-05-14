import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export { formatAED, type FormatAEDOptions } from "./format";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
