import Link from "next/link";
import { Destination } from "./destination";

export default function Data({ data = [] }) {
   return (
      <div className="max-w-6xl w-full mx-auto space-y-8 my-8 p-4">
         {data.map((dt, i) => (
            <div key={i} className="space-y-4">
               <div className="flex justify-between gap-4 items-center">
                  <div className="text-lg font-semibold leading-none">
                     {dt.nama}
                     <div className="h-2 border-b-2"></div>
                  </div>
                  <Link
                     href={`/destinasi?kategori=${dt.slug}`}
                     className="underline text-xs"
                  >
                     See All
                  </Link>
               </div>
               <Destination kategoriSlug={dt.slug} />
            </div>
         ))}
      </div>
   );
}
