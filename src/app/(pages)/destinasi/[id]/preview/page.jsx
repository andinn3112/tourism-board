import { EditDestinasi } from "@/components/button/form-destinasi";
import MapEmbed from "@/components/map";
import { getDestinationById } from "@/lib/query";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }) {
   const { id } = await params;
   const data = await getDestinationById(id);

   if (!data) {
      notFound();
   }

   return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
         {/* Header Section */}
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3">
                  {data.kategori && (
                     <Link
                        href={`/kategori/${data.kategori.slug}`}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                     >
                        {data.kategori.nama}
                     </Link>
                  )}
               </div>
               <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {data.nama}
               </h1>
               {data.lokasi && (
                  <div className="flex items-center text-gray-600">
                     <svg
                        className="w-5 h-5 mr-2"
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
                     <span className="text-lg">{data.lokasi}</span>
                  </div>
               )}
            </div>
            <EditDestinasi id={data.id} />
         </div>

         {/* Gallery Section */}
         {data.images && data.images.length > 0 && (
            <div className="mb-8">
               {data.images.length === 1 ? (
                  // Single Image
                  <div className="relative h-96 w-full rounded-2xl overflow-hidden">
                     <Image
                        src={data.images[0]?.url}
                        alt={data.nama}
                        fill
                        className="object-cover"
                        priority
                     />
                  </div>
               ) : (
                  // Multiple Images Grid
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {data.images.map((image, index) => (
                        <div
                           key={index}
                           className={`relative h-64 rounded-xl overflow-hidden ${
                              index === 0 && data.images.length % 2 !== 0
                                 ? "md:col-span-2 lg:col-span-2"
                                 : ""
                           }`}
                        >
                           <Image
                              src={image}
                              alt={`${data.nama} - Gambar ${index + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                           />
                           {/* Image Counter Badge */}
                           <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                              {index + 1}/{data.images.length}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* Content Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
               {/* Description */}
               <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                     Deskripsi
                  </h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                     {data.deskripsi ? (
                        <p className="whitespace-pre-line">{data.deskripsi}</p>
                     ) : (
                        <p className="text-gray-500 italic">
                           Tidak ada deskripsi tersedia.
                        </p>
                     )}
                  </div>
               </section>

               {/* Additional Information */}
               {(data.fasilitas || data.harga || data.jam_operasional) && (
                  <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                     <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Informasi Tambahan
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.fasilitas && (
                           <div>
                              <h3 className="font-medium text-gray-900 mb-2">
                                 Fasilitas
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                 {Array.isArray(data.fasilitas) ? (
                                    data.fasilitas.map((fasilitas, index) => (
                                       <span
                                          key={index}
                                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                                       >
                                          {fasilitas}
                                       </span>
                                    ))
                                 ) : (
                                    <span className="text-gray-700">
                                       {data.fasilitas}
                                    </span>
                                 )}
                              </div>
                           </div>
                        )}

                        {data.harga && (
                           <div>
                              <h3 className="font-medium text-gray-900 mb-2">
                                 Harga
                              </h3>
                              <p className="text-lg font-semibold text-blue-600">
                                 {data.harga}
                              </p>
                           </div>
                        )}

                        {data.jam_operasional && (
                           <div className="md:col-span-2">
                              <h3 className="font-medium text-gray-900 mb-2">
                                 Jam Operasional
                              </h3>
                              <p className="text-gray-700">
                                 {data.jam_operasional}
                              </p>
                           </div>
                        )}
                     </div>
                  </section>
               )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
               {/* Map Section */}
               <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                     Lokasi
                  </h2>
                  <div className="rounded-xl overflow-hidden">
                     <MapEmbed coordinate={data.koordinat} />
                  </div>
                  {data.alamat_lengkap && (
                     <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                           {data.alamat_lengkap}
                        </p>
                     </div>
                  )}
               </section>

               {/* Contact Info jika ada */}
               {data.kontak && (
                  <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                     <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Kontak
                     </h2>
                     <div className="space-y-2">
                        <p className="text-gray-700">{data.kontak}</p>
                     </div>
                  </section>
               )}
            </div>
         </div>
      </div>
   );
}
