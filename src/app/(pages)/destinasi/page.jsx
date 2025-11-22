import { buttonVariants } from "@/components/ui/button";
import { getDestination } from "@/lib/query";
import Link from "next/link";
import Data from "./data";

export default async function Page() {
  const data = await getDestination();
  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-xl">Destinasi</h1>
      <Link href="/destinasi/new/form" className={buttonVariants()}>
        Tambah Destinasi
      </Link>
      <Data data={data} />
    </div>
  );
}
