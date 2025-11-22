import EditButton from "@/components/button/edit";
import MapEmbed from "@/components/map";
import { getDestinationById } from "@/lib/query";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { id } = await params;

  const data = await getDestinationById(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between gap-4">
        <h1 className="text-xl">{data?.name}</h1>
        <EditButton link={`/destinasi/${id}/form`} />
      </div>
      <div>
        <div>{data?.description}</div>
        <MapEmbed coordinate={data?.coordinate} />
      </div>
    </div>
  );
}
