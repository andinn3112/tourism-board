import { getCategories } from "@/lib/query";
import Data from "./data";

export async function DestinationByCategory() {
   const query = await getCategories({});

   return <Data query={query} />;
}
