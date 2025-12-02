import { getDestination } from "@/lib/query";
import { MapPin, Star } from "lucide-react";
import Link from "next/link";

export async function Destination({ kategoriSlug }) {
   const { data = [] } = await getDestination({
      kategori: kategoriSlug,
      limit: 6,
   });

   if (data.length === 0) return null;

   return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
         {data.map((destinasi) => {
            return (
               <Link
                  key={destinasi.id}
                  href={`/destinasi/${destinasi.id}/preview`}
                  className="group"
               >
                  <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                     {/* Image */}
                     <div className="relative h-48 bg-gray-200">
                        {destinasi.images?.[0]?.imageUrl ? (
                           <img
                              src={destinasi.images[0].imageUrl}
                              alt={destinasi.nama}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <MapPin className="w-10 h-10 text-gray-400" />
                           </div>
                        )}
                     </div>

                     {/* Content */}
                     <div className="p-4">
                        <h3 className="font-bold mb-2 group-hover:text-primary">
                           {destinasi.nama}
                        </h3>

                        <div className="flex items-center text-foreground/60 text-xs mb-3">
                           <MapPin className="w-4 h-4 mr-1" />
                           <span className="truncate">{destinasi.alamat}</span>
                        </div>
                     </div>
                  </div>
               </Link>
            );
         })}
      </div>
   );
}
