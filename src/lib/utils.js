import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // ganti spasi dengan dash
    .replace(/[^a-z0-9-]/g, "") // hapus karakter asing
    .replace(/-+/g, "-") // hilangkan dash dobel
    .replace(/^-+|-+$/g, ""); // trim dash di awal/akhir
}
