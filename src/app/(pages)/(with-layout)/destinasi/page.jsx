import { getDestination } from "@/lib/query";
import Data from "./data";
import { withMetadata } from "@/lib/metadata";
import { TambahDestinasi } from "@/components/button/form-destinasi";
import SearchBar from "@/components/search-bar";
import LinkKategori from "@/components/button/link-kategori";

export const generateMetadata = withMetadata("Destinasi");

export default async function Page({ searchParams }) {
   const { search, page, limit, kategori } = await searchParams;

   const query = await getDestination({ search, page, limit, kategori });

   return (
      <div className="max-w-6xl mx-auto w-full space-y-4 p-4">
         <div className="flex justify-between gap-4">
            <h1 className="text-xl">Explore Destinasi</h1>
            <div className="flex items-center gap-2">
               <LinkKategori />
               <TambahDestinasi />
            </div>
         </div>
         <div>{kategori && `Kategori : ${kategori}`} </div>
         <SearchBar />
         <Data query={query} />
      </div>
   );
}
