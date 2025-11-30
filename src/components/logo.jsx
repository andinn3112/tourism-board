import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Logo({ className = "size-20" }) {
   return (
      <div className={cn("relative w-full h-full", className)}>
         <Image
            src="/images/logo.png"
            alt="logo"
            fill
            priority
            sizes="100%"
            className="object-contain"
         />
      </div>
   );
}
