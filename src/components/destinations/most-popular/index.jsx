import { getMostPopuler } from "@/lib/query";
import { Data } from "./data";

export async function MostPopular() {
   const query = await getMostPopuler();
   return <Data query={query} />;
}
