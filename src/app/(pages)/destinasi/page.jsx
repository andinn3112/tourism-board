import { getDestination } from "@/lib/query";
import Data from "./data";
import { withMetadata } from "@/lib/metadata";
import { TambahDestinasi } from "@/components/button/form-destinasi";

export const generateMetadata = withMetadata("Destinasi");

export default async function Page() {
   const data = await getDestination();

   return (
      <div className="max-w-7xl mx-auto w-full space-y-6 p-4">
         <div className="flex justify-between gap-4">
            <h1 className="text-xl">Destinasi</h1>
            <TambahDestinasi />
         </div>

         <Data data={data} />
      </div>
   );
}
