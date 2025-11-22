import { buttonVariants } from "@/components/ui/button";
import { getDestinationById } from "@/lib/query";
import Link from "next/link";
import { notFound } from "next/navigation";
import Form from "./form";

export default async function Page({ params }) {
  const { id } = await params;

  const data = await getDestinationById(id);

  // kalau edit dan tidak ada data...
  if (id != "new" && !data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl">{id == "new" ? "Tambah" : "Edit"} Destinasi</h1>

      <div className="space-y-2 w-full mx-auto max-w-xl">
        <Form data={data} />
      </div>
    </div>
  );
}
