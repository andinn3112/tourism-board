import EmptyData from "@/components/empty-data";
import Link from "next/link";

export default function Data({ data }) {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4">
      {data?.length > 0 ? (
        data?.map((item, i) => <DestinationLists data={item} key={i} />)
      ) : (
        <EmptyData />
      )}
    </div>
  );
}

function DestinationLists({ data }) {
  return (
    <Link href={`/destinasi/${data.id}/preview`} className="flex">
      {data.name}
    </Link>
  );
}
