import { DestinationByCategory, MostPopular } from "@/components/destinations";

export default async function Page() {
   return (
      <div className="-mt-6 md:-mt-25">
         <MostPopular />
         <DestinationByCategory />
      </div>
   );
}
