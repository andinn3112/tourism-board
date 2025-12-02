import { buttonVariants } from "@/components/ui/button";
import { getDestinationById, getCategories } from "@/lib/query";
import Link from "next/link";
import { notFound } from "next/navigation";
import Form from "./form";
import { getUser } from "@/lib/session";
import { withMetadata } from "@/lib/metadata";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

export const generateMetadata = withMetadata("Form Destinasi");

export default async function Page({ params }) {
   const { id } = await params;
   const user = await getUser();

   if (!user) {
      return (
         <div className="container mx-auto text-center py-20">
            <h2 className="text-2xl mb-4">Anda harus login terlebih dahulu</h2>
            <Link href="/login" className={buttonVariants()}>
               Login
            </Link>
         </div>
      );
   }

   const data = await getDestinationById(id);
   const queryCategory = await getCategories({ limit: 100 });

   // kalau edit dan tidak ada data...
   if (id != "new" && !data) {
      notFound();
   }

   return (
      <div className="w-full mx-auto max-w-6xl space-y-6 p-4">
         <h1 className="text-xl font-semibold">
            {id == "new" ? "Tambah" : "Edit"} Destinasi
         </h1>

         <div className="space-y-2">
            <Form data={data} categories={queryCategory?.data} />
         </div>
      </div>
   );
}
