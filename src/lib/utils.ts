import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Генерирует уникальный UUID через библиотеку uuid (работает и по HTTP, и по HTTPS). */
export function randomId(): string {
  return uuidv4();
}
