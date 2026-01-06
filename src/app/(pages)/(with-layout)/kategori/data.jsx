"use client";
import EmptyData from "@/components/empty-data";
import Link from "next/link";
import Image from "next/image";
import {
   EditDestinasi,
   HapusDestinasi,
} from "@/components/button/form-destinasi";
import { HapusKategori } from "@/components/button/form-kategori";

export default function Data({ data = [] }) {
   return (
      <div className="space-y-2 w-full max-w-lg mx-auto">
         {data?.length > 0 ? (
            data?.map((item, i) => (
               <div
                  key={i}
                  className="border p-4 rounded-lg flex justify-between gap-4"
               >
                  <div>{item.nama}</div>
                  <HapusKategori id={item.id} />
               </div>
            ))
         ) : (
            <EmptyData />
         )}
      </div>
   );
}

function DestinationList({ data }) {
   return (
      <div className="flex flex-col bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-card">
         {/* Image Section */}
         <Link
            href={`/destinasi/${data.id}/preview`}
            className="relative h-48 w-full bg-gray-200"
         >
            {data.images?.[0] ? (
               <Image
                  src={data.images[0]?.imageUrl || "images/no-preview.jpg"}
                  alt={data.nama}
                  fill
                  loading="eager"
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
               />
            ) : (
               <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg
                     className="w-12 h-12 text-gray-400"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                     />
                  </svg>
               </div>
            )}
         </Link>

         {/* Content Section */}
         <div className="p-4 flex-1">
            <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
               {data.nama}
            </h3>

            {data.deskripsi && (
               <p className="text-sm text-foreground/60 line-clamp-3 mb-3">
                  {data.deskripsi}
               </p>
            )}

            {data.lokasi && (
               <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg
                     className="w-4 h-4 mr-1"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                     />
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                     />
                  </svg>
                  <span className="line-clamp-1">{data.lokasi}</span>
               </div>
            )}

            {/* Edit Button */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
               <span className="text-xs text-gray-500">Klik untuk preview</span>
               <div className="flex gap-2">
                  <EditDestinasi id={data.id} />
                  <HapusDestinasi id={data.id} />
               </div>
            </div>
         </div>
      </div>
   );
}
