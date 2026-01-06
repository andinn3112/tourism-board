import { getCategories } from "@/lib/query";
import Data from "./data";
import { withMetadata } from "@/lib/metadata";

export const generateMetadata = withMetadata("Kategori");

export default async function Page() {
   const query = await getCategories();

   return (
      <div className="max-w-6xl mx-auto w-full space-y-4 p-4">
         <div className="flex justify-between gap-4">
            <h1 className="text-xl">Kategori</h1>
         </div>
         <Data data={query} />
      </div>
   );
}
