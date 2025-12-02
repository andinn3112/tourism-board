import Logo from "@/components/logo";
import { SITE_NAME } from "@/lib/env";

export default async function Loading() {
   return (
      <div className="h-screen w-screen flex flex-col justify-center items-center gap-2">
         <Logo className="size-30 animate-pulse" />
         <h5 className="font-semibold text-xl font-cairo">{SITE_NAME}</h5>
      </div>
   );
}
