import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts intelligently.
 * Import via: import { cn } from "@/lib/utils"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
