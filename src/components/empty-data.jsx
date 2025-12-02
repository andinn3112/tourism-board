"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyData({
   title = "Data tidak ditemukan",
   desc = "Data akan muncul di sini apabila telah tersedia.",
   actionLabel = null,
   onAction = null,
}) {
   return (
      <div className="w-full flex justify-center py-20">
         <Card className="border-none shadow-none bg-transparent text-center">
            <CardContent className="flex flex-col items-center gap-4">
               {/* Judul */}
               <h2 className="text-2xl font-semibold text-foreground/80">
                  {title}
               </h2>

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
