import { EditDestinasi } from "@/components/button/form-destinasi";
import MapEmbed from "@/components/map";
import { getDestination, getDestinationById } from "@/lib/query";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDestinationMetadata } from "@/lib/metadata";
import FormKomentar from "./form-komentar";
import { format } from "date-fns";

export async function generateMetadata({ params }) {
   const { id } = await params;
   return await getDestinationMetadata(id);
}

export async function generateStaticParams() {
   const res = await getDestination({ limit: 10 });
   const { data = [] } = res;
   return data.map((dt) => ({
      id: dt.id.toString(),
   }));
}

export default async function Page({ params }) {
   const { id } = await params;
   const data = await getDestinationById(id, "add-view");

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
               <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {data.nama}
               </h1>
               {data.alamat && (
                  <div className="flex items-center text-foreground/60">
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
                     <span className="text-lg">{data.alamat}</span>
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
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden">
                     <Image
                        src={data.images[0]?.imageUrl}
                        alt={data.nama}
                        fill
                        className="object-cover"
                        priority
                     />
                  </div>
               ) : (
                  // Multiple Images Grid
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {data.images.map((dt, index) => (
                        <div
                           key={index}
                           className="relative aspect-video rounded-xl overflow-hidden"
                        >
                           <Image
                              src={dt.imageUrl}
                              alt={`${data.nama} - Gambar ${index + 1}`}
                              fill
                              sizes="100%"
                              className="object-cover hover:scale-105 transition-transform duration-300"
                           />
                        </div>
                     ))}
                  </div>
               )}
            </div>
         )}

         {/* Content Grid */}
         <div className="grid gap-8">
            {/* Main Content */}
            <div className="space-y-6">
               {/* Description */}
               <section className="bg-card rounded-2xl p-6 shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Deskripsi</h2>
                  <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
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
            <div className="grid gap-6">
               {/* Map Section */}
               <section className="space-y-4">
                  <div className="rounded-xl overflow-hidden">
                     <MapEmbed coordinate={data.koordinat} />
                  </div>
                  {data.alamat && (
                     <p className="text-sm text-foreground/60">{data.alamat}</p>
                  )}
               </section>
               <section className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                     <FormKomentar destinasiId={data?.id} />
                     <div className="space-y-4">
                        <h1 className="text-xl">Komentar</h1>
                        <div className="space-y-2">
                           {data?.reviews?.length > 0
                              ? data?.reviews?.map((dt, i) => (
                                   <div
                                      key={i}
                                      className="bg-card p-4 rounded-lg"
                                   >
                                      <div className="text-xs text-foreground/50">
                                         {format(dt.createdAt, "dd/M/yyyy")}
                                      </div>
                                      <div className="font-semibold">
                                         {dt.nama}
                                      </div>
                                      <div className="text-sm text-foreground/80">
                                         {dt.komentar}
                                      </div>
                                   </div>
                                ))
                              : "Belum ada komentar terkait destinasi ini"}
                        </div>
                     </div>
                  </div>
               </section>
            </div>
         </div>
      </div>
   );
}
