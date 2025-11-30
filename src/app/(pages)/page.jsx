import { getDestination } from "@/lib/query";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const data = await getDestination();
  return (
    <div>
      <div>
        {data.map((item) => (
          <div key={item.id}>
            <h2>{item.nama}</h2>
            <div className="relative w-full aspect-video">
              <Image
                src={item.images?.[0]?.url}
                alt={item.nama}
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
            <p>{item.deskripsi}</p>
          </div>
        ))}
      </div>
      <br />
      <Link href="/login">Login</Link>
    </div>
  );
}
