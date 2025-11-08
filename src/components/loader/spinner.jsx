"use client";

import { Loader } from "lucide-react";

export function LoaderSpinner({ show, text = "Loading" }) {
   return (
      <>
         {show && (
            <div className="absolute h-full w-full flex flex-col justify-center items-center backdrop-blur-[2px] gap-2 z-20">
               <Loader className="size-6 animate-spin text-primary" />
               <div>{text}</div>
            </div>
         )}
      </>
   );
}
