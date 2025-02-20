import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrentDate() {
    return new Date().toISOString().split('T')[0]; // 返回格式为 YYYY-MM-DD 的日期
}
