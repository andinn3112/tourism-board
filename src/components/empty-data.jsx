"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchX } from "lucide-react";

export default function EmptyData({
  title = "Tidak ada data ditemukan",
  desc = "Data akan muncul di sini setelah tersedia.",
  actionLabel = null,
  onAction = null,
}) {
  return (
    <div className="w-full flex justify-center py-20">
      <Card className="border-none shadow-none bg-transparent text-center">
        <CardContent className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-sky-50 text-sky-600 shadow-sm">
            <SearchX size={50} />
          </div>

          {/* Judul */}
          <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>

          {/* Deskripsi */}
          <p className="text-sm text-slate-600 max-w-md">{desc}</p>

          {/* Button Opsional */}
          {actionLabel && (
            <Button
              onClick={onAction}
              className="mt-2 bg-sky-600 text-white hover:bg-sky-700"
            >
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
