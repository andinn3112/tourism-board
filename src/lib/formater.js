import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function numberFormat(value) {
   if (!value) return 0;
   return new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
   }).format(value);
}

export function formatRupiah(value) {
   if (!value) return 0;
   return `Rp. ${numberFormat(value)}`;
}

export function strToUnderscore(text) {
   if (!text) return null;
   return text
      .toLowerCase() // lowercase semua huruf
      .replace(/[^\w\s-]/g, "") // hapus karakter aneh (selain huruf/angka/spasi)
      .replace(/\s+/g, "_") // ganti spasi jadi underscore
      .replace(/_+/g, "_") // hindari underscore berlebih
      .trim(); // hapus spasi di awal/akhir jika ada
}

export function slugToTitle(slug) {
   if (!slug) return null;
   return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

export function timeFormat(time) {
   // Pecah string "HH:mm:ss"
   const [hours, minutes, seconds] = time.split(":").map(Number);

   // Ambil hari ini
   const today = new Date();
   today.setHours(hours, minutes || 0, seconds || 0, 0);

   return format(today, "HH:mm", { locale: id });
}

/**
 * Format tanggal
 * @param {string|Date} date - Date object atau ISO string
 * @param {string} dateFormat - format string date-fns, default "dd/MM/yyyy"
 * @returns {string}
 */
export function formatDate(date, dateFormat = "dd/MM/yyyy") {
   if (!date) return "-";
   const d = typeof date === "string" ? parseISO(date) : date;
   return format(d, dateFormat, { locale: id });
}

/**
 * Format waktu
 * @param {string|Date} date - Date object atau ISO string
 * @param {string} timeFormat - format string date-fns, default "HH:mm"
 * @returns {string}
 */
export function formatTime(date, timeFormat = "HH:mm") {
   if (!date) return "-";
   const d = typeof date === "string" ? parseISO(date) : date;
   return format(d, timeFormat, { locale: id });
}

/**
 * Format tanggal + waktu
 * @param {string|Date} date - Date object atau ISO string
 * @param {string} dateTimeFormat - format string date-fns, default "dd/MM/yyyy HH:mm"
 * @returns {string}
 */
export function formatDateTime(date, dateTimeFormat = "dd/MM/yyyy HH:mm") {
   if (!date) return "-";
   const d = typeof date === "string" ? parseISO(date) : date;
   return format(d, dateTimeFormat, { locale: id });
}

export function getDateToday() {
   const d = new Date();
   const year = d.getFullYear();
   const month = String(d.getMonth() + 1).padStart(2, "0");
   const day = String(d.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}

export function getDateLastWeek() {
   const d = new Date();
   d.setDate(d.getDate() - 7);
   const year = d.getFullYear();
   const month = String(d.getMonth() + 1).padStart(2, "0");
   const day = String(d.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}

export function getDateLastMonth() {
   const d = new Date();
   d.setMonth(d.getMonth() - 1);
   const year = d.getFullYear();
   const month = String(d.getMonth() + 1).padStart(2, "0");
   const day = String(d.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}
